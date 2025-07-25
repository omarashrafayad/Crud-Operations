'use client'

import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/store/store'
import { addProduct, updateProduct } from '@/store/productSlice'
import Image from 'next/image'

export default function ProductForm() {
    const dispatch = useDispatch<AppDispatch>()
    const editing = useSelector((state: RootState) => state.products.editingProduct)

    const [title, setTitle] = useState('')
    const [price, setPrice] = useState('')
    const [taxes, setTaxes] = useState('')
    const [ads, setAds] = useState('')
    const [discount, setDiscount] = useState('')
    const [category, setCategory] = useState('')
    const [image, setImage] = useState<File | null>(null)
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const [isEditMode, setIsEditMode] = useState(false)
    const [editId, setEditId] = useState<number | null>(null)
    const [error, setError] = useState('')

    const total =
        Number(price || 0) + Number(taxes || 0) + Number(ads || 0) - Number(discount || 0)

    useEffect(() => {
        if (editing) {
            setIsEditMode(true)
            setEditId(editing.id)
            setTitle(editing.title)
            setPrice(editing.price.toString())
            setTaxes(editing.taxes.toString())
            setAds(editing.ads.toString())
            setDiscount(editing.discount.toString())
            setCategory(editing.category)
            setImagePreview(editing.image || null)
        }
    }, [editing])

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        setImage(file || null)
        if (file) setImagePreview(URL.createObjectURL(file))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        // التحقق من الحقول المطلوبة
        if (!title || !price || !taxes || !ads || !discount || !category || (!image && !imagePreview)) {
            setError('من فضلك املأ جميع الحقول وأضف صورة')
            return;
        }

        const product = {
            id: isEditMode && editId ? editId : Date.now(),
            title,
            price: Number(price),
            taxes: Number(taxes),
            ads: Number(ads),
            discount: Number(discount),
            total,
            category,
            image: imagePreview,
        }

        if (isEditMode && editId !== null) {
            dispatch(updateProduct({ id: editId, updated: product }))
        } else {
            dispatch(addProduct(product))
        }

        // إعادة تعيين النموذج
        setTitle('')
        setPrice('')
        setTaxes('')
        setAds('')
        setDiscount('')
        setCategory('')
        setImage(null)
        setImagePreview(null)
        setIsEditMode(false)
        setEditId(null)
        setError('')
    }

    return (
        <form onSubmit={handleSubmit} className="max-w-xl mx-auto p-4 space-y-4 bg-gray-800 text-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-center">{isEditMode ? 'Update Product' : 'Add Product'}</h2>

            {error && <p className="text-red-500 bg-red-100 p-2 rounded text-center">{error}</p>}

            <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-2 rounded bg-gray-700" />
            <input type="number" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full p-2 rounded bg-gray-700" />
            <input type="number" placeholder="Taxes" value={taxes} onChange={(e) => setTaxes(e.target.value)} className="w-full p-2 rounded bg-gray-700" />
            <input type="number" placeholder="Ads" value={ads} onChange={(e) => setAds(e.target.value)} className="w-full p-2 rounded bg-gray-700" />
            <input type="number" placeholder="Discount" value={discount} onChange={(e) => setDiscount(e.target.value)} className="w-full p-2 rounded bg-gray-700" />
            <input type="text" placeholder="Category" value={category} onChange={(e) => setCategory(e.target.value)} className="w-full p-2 rounded bg-gray-700" />

            <input type="file" accept="image/*" onChange={handleImageChange} className="w-full text-sm" />

            {imagePreview && <Image src={imagePreview} alt="Preview" width={40} height={40} className=" object-cover rounded mx-auto" />}

            <div className="text-center font-semibold">
                Total: <span className="text-green-400">{total || 0}</span>
            </div>

            <button type="submit" className="bg-purple-700 hover:bg-purple-900 w-full p-2 rounded">
                {isEditMode ? 'Update' : 'Create'}
            </button>
        </form>
    )
}
