const headingTags = [
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
];

const headingCommands = [
    [ 'h1 ' , '# ' ],
    [ 'h2 ' , '## ' ],
    [ 'h3 ' , '### ' ],
    [ 'h4 ' , '#### ' ],
    [ 'h5 ' , '##### ' ],
]

const listTags = [
    'ul',
    'ol',
];

const listCommands = [
    ['ul ','- '],
    ['ol ','+ '],
]

const underLineTags = [
    'hr',
]

const underLineCommands = [
    ['hr ','***'],
]

const blockQuoteTags = [
    'blockquote'
]

const blockQuoteCommands = [
    ['bq ','> '],
]

const inlineCodes = [
    'code',
    'del',
]

const inlineCommands = [
    [/.*(\`).+(\`)/, '`'],
    [/.*(\~{2}).+(\~{2})/, '~~'],
]

const codeDouble = [
    'strong',
]

const commandDouble = [
    [/.*(\*{2}).+(\*{2})/, '**'],
]

const codeSingle = [
    'em'
]

const commandSingle = [
    [/.*(\*{1}).+(\*{1})/, '*'],
]

