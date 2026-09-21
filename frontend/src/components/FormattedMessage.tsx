import React from 'react';

interface FormattedMessageProps {
  content: string;
  isUser?: boolean;
}

/**
 * Parses inline markdown:
 * - ***bold italic***
 * - **bold** (replaces asterisks with clean, high-visibility bold)
 * - *italic*
 * - `code`
 */
function parseInline(text: string, isUser: boolean): React.ReactNode[] {
  const regex = /(\*\*\*[^*\n]+?\*\*\*|\*\*[^*\n]+?\*\*|\*[^*\n]+?\*|`[^`\n]+?`)/g;
  const nodes: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.substring(lastIndex, match.index));
    }
    const token = match[0];

    if (token.startsWith('***') && token.endsWith('***')) {
      nodes.push(
        <strong
          key={key++}
          className={
            isUser
              ? 'font-extrabold italic text-white'
              : 'font-extrabold italic text-slate-950 dark:text-white'
          }
        >
          {token.slice(3, -3)}
        </strong>
      );
    } else if (token.startsWith('**') && token.endsWith('**')) {
      nodes.push(
        <strong
          key={key++}
          className={
            isUser
              ? 'font-bold text-white underline decoration-white/30 underline-offset-2'
              : 'font-bold text-slate-950 dark:text-white'
          }
        >
          {token.slice(2, -2)}
        </strong>
      );
    } else if (token.startsWith('*') && token.endsWith('*')) {
      nodes.push(
        <em
          key={key++}
          className={
            isUser
              ? 'italic text-white/90'
              : 'italic text-slate-700 dark:text-slate-300'
          }
        >
          {token.slice(1, -1)}
        </em>
      );
    } else if (token.startsWith('`') && token.endsWith('`')) {
      nodes.push(
        <code
          key={key++}
          className={
            isUser
              ? 'bg-white/20 text-white px-1.5 py-0.5 rounded text-xs font-mono'
              : 'bg-slate-100 dark:bg-[#252525] text-[#E21E26] dark:text-red-400 border border-slate-200 dark:border-slate-800 px-1.5 py-0.5 rounded text-xs font-mono font-bold'
          }
        >
          {token.slice(1, -1)}
        </code>
      );
    }
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    nodes.push(text.substring(lastIndex));
  }

  return nodes.length > 0 ? nodes : [text];
}

interface TableBlock {
  type: 'table';
  headers: string[];
  rows: string[][];
}

interface NormalBlock {
  type: 'lines';
  lines: string[];
}

type ParsedBlock = TableBlock | NormalBlock;

/**
 * Splits raw content into structured blocks (tables vs line groups)
 */
function parseBlocks(content: string): ParsedBlock[] {
  const rawLines = content.split('\n');
  const blocks: ParsedBlock[] = [];
  let currentTableLines: string[] = [];
  let currentNormalLines: string[] = [];

  const flushNormal = () => {
    if (currentNormalLines.length > 0) {
      blocks.push({ type: 'lines', lines: [...currentNormalLines] });
      currentNormalLines = [];
    }
  };

  const flushTable = () => {
    if (currentTableLines.length > 0) {
      const rows = currentTableLines.map((line) => {
        const parts = line.split('|');
        if (parts.length >= 2) {
          return parts.slice(1, -1).map((c) => c.trim());
        }
        return [];
      }).filter((row) => row.length > 0);

      if (rows.length > 0) {
        const headers = rows[0];
        // Check if row 1 is a delimiter (|---|---|)
        let bodyRows = rows.slice(1);
        if (bodyRows.length > 0 && bodyRows[0].every((cell) => /^[-:\s]+$/.test(cell))) {
          bodyRows = bodyRows.slice(1);
        }
        blocks.push({ type: 'table', headers, rows: bodyRows });
      }
      currentTableLines = [];
    }
  };

  for (const line of rawLines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
      flushNormal();
      currentTableLines.push(trimmed);
    } else {
      flushTable();
      currentNormalLines.push(line);
    }
  }

  flushTable();
  flushNormal();

  return blocks;
}

export const FormattedMessage: React.FC<FormattedMessageProps> = ({
  content,
  isUser = false,
}) => {
  if (!content) return null;

  const blocks = parseBlocks(content);

  return (
    <div
      className={`space-y-2 leading-relaxed ${
        isUser
          ? 'font-sans text-sm sm:text-base text-white'
          : 'font-alike text-[15px] sm:text-[16px] md:text-[16.5px] leading-[1.8] text-slate-900 dark:text-[#f3f0ec] tracking-normal'
      }`}
    >
      {blocks.map((block, bIdx) => {
        if (block.type === 'table') {
          return (
            <div
              key={bIdx}
              className="my-3 overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs bg-white dark:bg-[#181818]"
            >
              <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800 text-xs sm:text-sm">
                <thead className="bg-slate-50 dark:bg-slate-900/80">
                  <tr>
                    {block.headers.map((h, hIdx) => (
                      <th
                        key={hIdx}
                        className="px-3.5 py-2.5 text-left font-extrabold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]"
                      >
                        {parseInline(h, isUser)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {block.rows.map((row, rIdx) => (
                    <tr
                      key={rIdx}
                      className={
                        rIdx % 2 === 0
                          ? 'bg-white dark:bg-[#181818]'
                          : 'bg-slate-50/50 dark:bg-[#1c1c1c]'
                      }
                    >
                      {row.map((cell, cIdx) => (
                        <td
                          key={cIdx}
                          className="px-3.5 py-2.5 text-slate-800 dark:text-slate-200 align-top"
                        >
                          {parseInline(cell, isUser)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }

        // Render normal lines with headers, bullets, numbers, and paragraphs
        return (
          <div key={bIdx} className="space-y-1">
            {block.lines.map((line, lIdx) => {
              const trimmed = line.trim();

              // Empty lines: paragraph gap
              if (trimmed === '') {
                return <div key={lIdx} className="h-2" />;
              }

              // Heading: ### Header or ## Header
              if (/^#{1,4}\s+(.*)$/.test(trimmed)) {
                const headingMatch = trimmed.match(/^#{1,4}\s+(.*)$/);
                const headingText = headingMatch ? headingMatch[1] : trimmed;
                return (
                  <h4
                    key={lIdx}
                    className={`text-base sm:text-lg mt-3 mb-1.5 ${
                      isUser
                        ? 'font-sans font-extrabold text-white'
                        : 'font-alike font-bold text-slate-950 dark:text-white'
                    }`}
                  >
                    {parseInline(headingText, isUser)}
                  </h4>
                );
              }

              // Numbered list item: e.g. "1. **Titre** : Description"
              const numMatch = trimmed.match(/^(\d+)\.\s+(.*)$/);
              if (numMatch) {
                const num = numMatch[1];
                const rest = numMatch[2];
                return (
                  <div key={lIdx} className="flex items-start gap-2.5 my-1.5 pl-0.5">
                    <span
                      className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-xs font-extrabold flex-shrink-0 mt-0.5 ${
                        isUser
                          ? 'bg-white/20 text-white'
                          : 'bg-red-100 dark:bg-red-950/70 text-[#E21E26] dark:text-red-400 border border-red-200/50 dark:border-red-900/40'
                      }`}
                    >
                      {num}
                    </span>
                    <div className="flex-1">
                      {parseInline(rest, isUser)}
                    </div>
                  </div>
                );
              }

              // Bullet item: e.g. "• **Point** : Text" or "- **Point** : Text" or "* **Point** : Text"
              const bulletMatch = trimmed.match(/^([•\-\*])\s+(.*)$/);
              if (bulletMatch) {
                const rest = bulletMatch[2];
                return (
                  <div key={lIdx} className="flex items-start gap-2.5 my-1 pl-1">
                    <span
                      className={`w-1.5 h-1.5 rounded-full flex-shrink-0 mt-2 ${
                        isUser ? 'bg-white' : 'bg-[#E21E26]'
                      }`}
                    />
                    <div className="flex-1">
                      {parseInline(rest, isUser)}
                    </div>
                  </div>
                );
              }

              // Regular line of text with bold/italic parsed
              return (
                <div key={lIdx} className="leading-relaxed">
                  {parseInline(line, isUser)}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export default FormattedMessage;
