import ProductForm from '@/components/ProductForm'
import ProductTable from '@/components/ProductTable'

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white py-10 px-4">
      <ProductForm />
      <ProductTable />
    </main>
  )
}
