/* =============================================================================
   cloud-style — CONTENT

   This is the only file you edit to make a new deck. index.html renders
   whatever is here; no other file needs to change.

   SHAPE
     brand      wordmark split into a bold half and a regular half, plus the
                cover copy and the footer edition line
     categories the menu. Each has an icon id (see js/gc-icons.js), a title,
                and a list of facts
     facts      each becomes a card on screen 03 and an article on screen 04

   ICON IDS available out of the box:
     gc-icon-identity  gc-icon-catalog  gc-icon-support
     gc-icon-mobile-check  gc-icon-open  gc-icon-cloud
   Add more by appending <symbol> blocks to js/gc-icons.js.
   ========================================================================== */

const CONTENT = {

  brand: {
    /* The wordmark is one word split in two. Bold = product, light = category.
       Keep it short: it renders at 10% of the screen width. */
    wordmarkBold: 'fin',
    wordmarkLight: 'facts',

    /* Cover lede. First two lines render bold, last two regular.
       Break the lines yourself — this is a poster, not a paragraph. */
    ledeStrong: ['Discoveries', 'and opportunities'],
    ledeSoft:   ['that add value to', 'financial services'],

    cta: 'See how we can help',
    edition: 'Edition 2026',

    /* Prefix for the miniature wordmark in each card header. */
    cardBold: 'fin',
    cardLight: 'fact',
  },

  categories: [
    {
      icon: 'gc-icon-identity',
      title: 'Onboarding, document upload and approval',
      facts: [
        {
          title: 'Half of the institutions did not open the account in real time',
          lede: 'The point of digital is skipping the waiting room.',
          body: 'You open a bank account: photograph the document, take the selfie, check the details, hit "finish". Done — now just use it. Except it often isn\'t. We measured the time between the end of signup and the account going live, and half the institutions we looked at did not finish in real time. Some were ready in minutes; others took hours, and one took more than three days. With customers less and less willing to wait, a slow start is a start that may not continue.',
          tag: '#AI',
          live: false,
        },
        {
          title: 'Only 4 of 20 offered conversational account opening',
          lede: 'A form is an interrogation. A conversation is a welcome.',
          body: 'Most onboarding flows are still a stack of fields. Four of the twenty institutions we tested let a customer open an account by talking — describing what they wanted and answering follow-ups in plain language, with the system filling the form behind the scenes. The rest asked people to translate their intent into someone else\'s data model.',
          tag: '#AI',
          live: true,
        },
        {
          title: '9 of 20 no longer require document upload at signup',
          lede: 'The best document is the one you never have to photograph.',
          body: 'Nearly half the institutions now pull identity data from registries and prior relationships instead of asking for a photo of an ID. That removes the single most abandoned step in the funnel — the one where a customer has to find good lighting, a flat surface, and their patience.',
          tag: '#Data',
          live: false,
        },
        {
          title: 'Only 3 offered voice guidance during face recognition',
          lede: 'If you can\'t see the screen, the screen should speak.',
          body: 'Liveness checks ask people to move their head, blink, or hold still — instructions delivered almost entirely as on-screen text. Three institutions spoke them aloud. For customers with low vision, and for anyone in bright sun, that is the difference between finishing and giving up.',
          tag: '#Accessibility',
          live: false,
        },
      ],
    },

    {
      icon: 'gc-icon-catalog',
      title: 'Products, services and personalisation',
      facts: [
        {
          title: 'Only 4 of 18 returned results for semantic searches',
          lede: 'People search for what they want, not what you called it.',
          body: 'We searched for outcomes — "somewhere to put money I don\'t need for a year" — rather than product names. Four of eighteen search boxes understood. The rest matched keywords, returned nothing, and quietly taught the customer that search does not work here.',
          tag: '#Search',
          live: false,
        },
        {
          title: 'Only 5 of 20 offer personal financial management',
          lede: 'A balance is a number. A pattern is an insight.',
          body: 'Every app shows a balance and a list of transactions. A quarter of them turn that into something useful: spend by category, month-over-month movement, a nudge before a bill lands. The data is already there — the difference is whether anyone did the work of interpreting it.',
          tag: '#Data',
          live: false,
        },
        {
          title: 'Only 5 chatbots acted as financial advisers',
          lede: 'Answering a question is not the same as giving advice.',
          body: 'Most assistants are routers: they find the FAQ page and hand it over. Five went further and reasoned about the customer\'s actual position — what they hold, what it costs, what a change would mean. That is the line between a help desk and a service.',
          tag: '#AI',
          live: true,
        },
      ],
    },

    {
      icon: 'gc-icon-support',
      title: 'Service channels and accessibility',
      facts: [
        {
          title: 'The gap between reading text and reading context',
          lede: 'A digital barrier is easier to take down than a physical one.',
          body: 'Screen readers can announce a label. They cannot explain why a transfer failed, or what to do next. The institutions that scored best did not have better markup — they had interfaces that stated their state in plain language, for everyone, whether or not assistive technology was involved.',
          tag: '#Accessibility',
          live: false,
        },
        {
          title: 'Only 13 of 20 use location or Wi-Fi as an extra signal',
          lede: 'Security that notices context asks fewer questions.',
          body: 'Signals a phone already has — where it is, which network it is on, whether this is the usual pattern — let a system relax the checks it does not need. Seven institutions ignored them and made every customer prove themselves the same way every time.',
          tag: '#Security',
          live: false,
        },
      ],
    },

    {
      icon: 'gc-icon-mobile-check',
      title: 'Ease and security in the app',
      facts: [
        {
          title: 'Only 1 of 20 read a handwritten payment key with the camera',
          lede: 'The camera turns pixels into payments.',
          body: 'Payment keys get written on napkins, printed on invoices, and screenshotted. One institution let a customer point a camera at any of those and pay. The other nineteen asked them to retype a 32-character string — a step that fails silently and often.',
          tag: '#AI',
          live: true,
        },
      ],
    },

    {
      icon: 'gc-icon-open',
      title: 'Open Finance',
      facts: [
        {
          title: 'Only 5 did not offer transactions from a linked account',
          lede: 'Open banking is only open if the money can move.',
          body: 'Fifteen institutions let a customer spend a balance held somewhere else, using consented data and initiated payments. Five stopped at showing the balance. Read access is a feature; write access is a product.',
          tag: '#OpenFinance',
          live: false,
        },
      ],
    },
  ],
};
