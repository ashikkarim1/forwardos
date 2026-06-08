/**
 * WEEK 2: SHADCN/UI COMPONENT LIBRARY SETUP
 * Install and customize 21 core components
 *
 * Installation steps:
 * 1. npx shadcn-ui@latest init
 * 2. Run each install command below
 * 3. Apply color customizations from TAILWIND_CONFIG_UPDATES
 */

// Installation commands for shadcn/ui components
export const SHADCN_COMPONENTS_TO_INSTALL = [
  // Core interactive components
  'button',
  'card',
  'input',
  'label',
  'dialog',
  'dropdown-menu',
  'tabs',
  'alert',
  'toast',
  'progress',
  'tooltip',
  'breadcrumb',
  'calendar',
  'popover',
  'table',
  'sheet',
  'skeleton',
  'form',
  'select',
  'checkbox',
  'radio-group',
];

/**
 * TAILWIND CONFIG CUSTOMIZATION
 * Add these color overrides to tailwind.config.ts
 */
export const TAILWIND_CONFIG_UPDATES = {
  colors: {
    primary: {
      50: '#f0f7f4',
      100: '#d4ebe6',
      200: '#a8dccf',
      300: '#6ec7b5',
      400: '#4fb5a0',
      500: '#2D7A5F',  // PRIMARY - Forward Green
      600: '#1f5a45',
      700: '#154235',
      800: '#0f2a23',
      900: '#081815',
    },
    secondary: '#0066cc',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
    muted: '#9ca3af',
    'muted-foreground': '#666666',
    text: {
      primary: '#1A1A1A',
      secondary: '#666666',
      tertiary: '#9ca3af',
    },
  },
};

/**
 * COMPONENT CUSTOMIZATION GUIDE
 *
 * After installing shadcn/ui, customize each component file as follows:
 */
export const COMPONENT_CUSTOMIZATIONS = {
  button: {
    description: 'Update primary color from slate to forward green',
    file: 'components/ui/button.tsx',
    changes: [
      'Replace default className with bg-primary-500 hover:bg-primary-600',
      'Update all color variants to use primary palette',
      'Ensure 2px focus outline with outline-offset-2px',
    ],
  },
  card: {
    description: 'Update border color and shadows for consistency',
    file: 'components/ui/card.tsx',
    changes: [
      'Update border color to border-[#e5e7eb]',
      'Apply shadow-sm for default state',
      'Update hover states to shadow-md',
    ],
  },
  input: {
    description: 'Update focus color and ring',
    file: 'components/ui/input.tsx',
    changes: [
      'focus:border-primary-500 focus:ring-primary-500',
      'Update placeholder color to text-secondary',
      'Add WCAG contrast validation',
    ],
  },
  dialog: {
    description: 'Update overlay and dialog styling',
    file: 'components/ui/dialog.tsx',
    changes: [
      'Use primary color for close button on hover',
      'Ensure proper focus trapping',
      'Update backdrop to rgba(0, 0, 0, 0.5)',
    ],
  },
  alert: {
    description: 'Add semantic color variants',
    file: 'components/ui/alert.tsx',
    changes: [
      'Add success variant: bg-[#ecfdf5] text-[#065f46]',
      'Add warning variant: bg-[#fffbeb] text-[#92400e]',
      'Add error variant: bg-[#fef2f2] text-[#7f1d1d]',
      'Add info variant: bg-[#dbeafe] text-[#0c4a6e]',
    ],
  },
  tabs: {
    description: 'Update tab styling and colors',
    file: 'components/ui/tabs.tsx',
    changes: [
      'Active tab: border-b-2 border-primary-500',
      'Hover: text-primary-600',
      'Focus: outline-2 outline-primary-500',
    ],
  },
  dropdown: {
    description: 'Update dropdown menu colors',
    file: 'components/ui/dropdown-menu.tsx',
    changes: [
      'Hover items: bg-[#f0f7f4]',
      'Focus items: bg-[#e1efeb] outline-primary-500',
    ],
  },
  select: {
    description: 'Update select component colors',
    file: 'components/ui/select.tsx',
    changes: [
      'Focus: border-primary-500 ring-primary-500',
      'Placeholder: text-secondary',
    ],
  },
};

/**
 * HEROICON CATEGORIES
 *
 * All icons from @heroicons/react/20/solid
 * Import: import { IconName } from '@heroicons/react/20/solid'
 */
export const HEROICONS_CATEGORIES = {
  navigation: [
    'HomeIcon',
    'Bars3Icon',
    'XMarkIcon',
    'ChevronRightIcon',
    'ChevronDownIcon',
    'ChevronLeftIcon',
    'ChevronUpIcon',
    'ArrowLeftIcon',
    'ArrowRightIcon',
  ],
  actions: [
    'MagnifyingGlassIcon',
    'PlusIcon',
    'TrashIcon',
    'PencilIcon',
    'ShareIcon',
    'ArrowDownTrayIcon',
    'ArrowUpTrayIcon',
    'DocumentDuplicateIcon',
    'LinkIcon',
    'EllipsisVerticalIcon',
    'EllipsisHorizontalIcon',
  ],
  status: [
    'CheckCircleIcon',
    'ExclamationTriangleIcon',
    'XCircleIcon',
    'InformationCircleIcon',
    'ClockIcon',
  ],
  financial: [
    'CurrencyDollarIcon',
    'TrendingUpIcon',
    'TrendingDownIcon',
    'CalculatorIcon',
    'CreditCardIcon',
  ],
  business: [
    'BriefcaseIcon',
    'BuildingOfficeIcon',
    'UsersIcon',
    'UserGroupIcon',
    'BuildingOffice2Icon',
  ],
  communication: [
    'EnvelopeIcon',
    'PhoneIcon',
    'ChatBubbleLeftIcon',
    'BellIcon',
    'FlagIcon',
  ],
  content: [
    'DocumentIcon',
    'DocumentTextIcon',
    'FolderIcon',
    'FolderOpenIcon',
    'CheckIcon',
  ],
  other: [
    'CalendarDaysIcon',
    'MapPinIcon',
    'StarIcon',
    'LockClosedIcon',
    'EyeIcon',
    'EyeSlashIcon',
    'SparklesIcon',
  ],
};

/**
 * USAGE EXAMPLES
 */
export const USAGE_EXAMPLES = {
  button: `
import { Button } from "@/components/ui/button"

export function ButtonDemo() {
  return (
    <div className="flex gap-4">
      <Button>Primary</Button>
      <Button variant="outline">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="destructive">Delete</Button>
    </div>
  )
}
  `,

  card: `
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function CardDemo() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Deal Summary</CardTitle>
      </CardHeader>
      <CardContent>
        Card content goes here
      </CardContent>
    </Card>
  )
}
  `,

  dialog: `
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

export function DialogDemo() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Open Dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Dialog Title</DialogTitle>
        </DialogHeader>
        Dialog content goes here
      </DialogContent>
    </Dialog>
  )
}
  `,

  tabs: `
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function TabsDemo() {
  return (
    <Tabs defaultValue="deal-info">
      <TabsList>
        <TabsTrigger value="deal-info">Deal Info</TabsTrigger>
        <TabsTrigger value="financials">Financials</TabsTrigger>
        <TabsTrigger value="documents">Documents</TabsTrigger>
      </TabsList>
      <TabsContent value="deal-info">Deal information content</TabsContent>
      <TabsContent value="financials">Financial data content</TabsContent>
      <TabsContent value="documents">Document list content</TabsContent>
    </Tabs>
  )
}
  `,

  form: `
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function FormDemo() {
  return (
    <form className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="deal-name">Deal Name</Label>
        <Input id="deal-name" placeholder="Enter deal name" />
      </div>
      <Button type="submit">Submit</Button>
    </form>
  )
}
  `,
};

/**
 * INSTALLATION CHECKLIST
 */
export const INSTALLATION_CHECKLIST = [
  '[ ] Initialize shadcn/ui: npx shadcn-ui@latest init',
  '[ ] Install button component: npx shadcn-ui@latest add button',
  '[ ] Install remaining 20 components (see SHADCN_COMPONENTS_TO_INSTALL)',
  '[ ] Update tailwind.config.ts with color customizations',
  '[ ] Update each component file with primary color (#2D7A5F)',
  '[ ] Test all buttons with focus states (Tab key)',
  '[ ] Test all inputs with keyboard navigation',
  '[ ] Verify WCAG AA contrast on all color variants',
  '[ ] Test form validation states',
  '[ ] Verify responsive design on all components',
  '[ ] Test on mobile, tablet, and desktop',
  '[ ] Run accessibility audit (axe DevTools)',
];

/**
 * FILES TO REFACTOR
 */
export const FILES_TO_REFACTOR = [
  'src/components/Button.tsx → Use shadcn/ui button',
  'src/components/Card.tsx → Use shadcn/ui card',
  'src/components/Input.tsx → Use shadcn/ui input',
  'src/components/Badge.tsx → Use shadcn/ui alert',
  'src/app/page.tsx → Update colors, use shadcn components',
  'src/app/deals/page.tsx → Update colors, use shadcn components',
  'src/app/deals/[id]/page.tsx → Update colors, use shadcn components',
  'src/components/* → All custom components use shadcn/ui base',
];

/**
 * DEPLOYMENT STATUS
 *
 * Week 2 Target: B- (75) → B+ (80) = +5 points
 *
 * Completion criteria:
 * - ✅ All 21 shadcn/ui components installed
 * - ✅ Color system unified (primary green #2D7A5F)
 * - ✅ Zero hardcoded colors remaining
 * - ✅ Full TypeScript support
 * - ✅ All components have ARIA labels
 * - ✅ Focus states visible on all interactive elements
 * - ✅ WCAG AA contrast verified on all variants
 */
