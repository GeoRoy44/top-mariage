const excludedTags = new Set(['strong', 'b', 'code', 'pre', 'script', 'style', 'svg', 'math']);

function hasBold(node) {
  if (node.type === 'element' && ['strong', 'b'].includes(node.tagName)) return true;
  return (node.children ?? []).some(hasBold);
}

function findText(node) {
  if (node.type === 'element' && excludedTags.has(node.tagName)) return null;
  const children = node.children ?? [];
  for (let index = 0; index < children.length; index += 1) {
    const child = children[index];
    if (child.type === 'text') {
      const match = child.value.match(/[\p{L}\p{N}][\p{L}\p{N}’'\-]*(?:[ \t]+[\p{L}\p{N}][\p{L}\p{N}’'\-]*){0,3}/u);
      if (match) return { parent: node, index, text: child.value, match };
    }
    const nested = findText(child);
    if (nested) return nested;
  }
  return null;
}

function emphasizeParagraph(node) {
  if (hasBold(node)) return;
  const candidate = findText(node);
  if (!candidate) return;
  const { parent, index, text, match } = candidate;
  const start = match.index ?? 0;
  const end = start + match[0].length;
  const replacement = [];
  if (start > 0) replacement.push({ type: 'text', value: text.slice(0, start) });
  replacement.push({
    type: 'element',
    tagName: 'strong',
    properties: {},
    children: [{ type: 'text', value: match[0] }],
  });
  if (end < text.length) replacement.push({ type: 'text', value: text.slice(end) });
  parent.children.splice(index, 1, ...replacement);
}

export default function rehypeBlogParagraphEmphasis() {
  return function transform(tree, file) {
    const rawPath = String(file.path ?? file.history?.[0] ?? '').replace(/\\/g, '/');
    if (!/(?:^|\/)src\/content\/blog\//.test(rawPath)) return;
    function visit(node) {
      if (node.type === 'element') {
        if (excludedTags.has(node.tagName)) return;
        if (node.tagName === 'p') {
          emphasizeParagraph(node);
          return;
        }
        if (['table', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(node.tagName)) return;
      }
      for (const child of node.children ?? []) visit(child);
    }
    visit(tree);
  };
}
