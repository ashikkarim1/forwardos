import { redirect } from 'next/navigation'

// CIM (confidential information memorandum) is a gated artifact. Until the
// authenticated, NDA-gated deal room ships, surface the masked listing page
// instead of the old mock CIM template.
interface Props { params: { id: string } }
export default function CimRedirect({ params }: Props): never {
  redirect(`/deal/${params.id}`)
}
