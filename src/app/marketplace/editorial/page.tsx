import { redirect } from 'next/navigation'

// The editorial layout graduated from this design-preview route into the
// main marketplace (filter bar + editorial rows). Redirect so there's one
// canonical page and no stale duplicate to drift out of sync.
export default function EditorialPreviewRedirect(): never {
  redirect('/marketplace')
}
