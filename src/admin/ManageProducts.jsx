import { useState, useEffect } from 'react';
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  updateDoc
} from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { MdAdd, MdEdit, MdDelete, MdClose } from 'react-icons/md';
import toast from 'react-hot-toast';

export default function ManageProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [imageError, setImageError] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    specifications: '',
    applications: '',
    image: ''
  });

  // =========================
  // FETCH PRODUCTS
  // =========================
  const fetchProducts = async () => {
    try {
      setLoading(true);

      const querySnapshot = await getDocs(
        collection(db, 'products')
      );

      const data = querySnapshot.docs.map((productDoc) => ({
        id: productDoc.id,
        ...productDoc.data()
      }));

      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // =========================
  // OPEN MODAL
  // =========================
  const handleOpenModal = (product = null) => {
    setImageError(false);

    if (product) {
      setEditingId(product.id);

      setFormData({
        title: product.title || '',
        category: product.category || '',
        description: product.description || '',
        specifications: Array.isArray(product.specifications)
          ? product.specifications.join(', ')
          : product.specifications || '',
        applications: Array.isArray(product.applications)
          ? product.applications.join(', ')
          : product.applications || '',
        image: product.image || ''
      });
    } else {
      setEditingId(null);

      setFormData({
        title: '',
        category: '',
        description: '',
        specifications: '',
        applications: '',
        image: ''
      });
    }

    setIsModalOpen(true);
  };

  // =========================
  // CLOSE MODAL
  // =========================
  const handleCloseModal = () => {
    if (saving) return;

    setIsModalOpen(false);
    setEditingId(null);
    setImageError(false);

    setFormData({
      title: '',
      category: '',
      description: '',
      specifications: '',
      applications: '',
      image: ''
    });
  };

  // =========================
  // HANDLE INPUT
  // =========================
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'image') {
      setImageError(false);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // =========================
  // SAVE / UPDATE
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error('Please enter product title');
      return;
    }

    if (!formData.category.trim()) {
      toast.error('Please enter product category');
      return;
    }

    if (!formData.description.trim()) {
      toast.error('Please enter product description');
      return;
    }

    setSaving(true);

    try {
      const productData = {
        title: formData.title.trim(),
        category: formData.category.trim(),
        description: formData.description.trim(),

        image: formData.image.trim(),

        specifications: formData.specifications
          ? formData.specifications
            .split(',')
            .map((item) => item.trim())
            .filter(Boolean)
          : [],

        applications: formData.applications
          ? formData.applications
            .split(',')
            .map((item) => item.trim())
            .filter(Boolean)
          : []
      };

      if (editingId) {
        await updateDoc(
          doc(db, 'products', editingId),
          productData
        );

        toast.success('Product updated successfully');
      } else {
        await addDoc(
          collection(db, 'products'),
          productData
        );

        toast.success('Product added successfully');
      }

      setIsModalOpen(false);
      setEditingId(null);

      setFormData({
        title: '',
        category: '',
        description: '',
        specifications: '',
        applications: '',
        image: ''
      });

      await fetchProducts();

    } catch (error) {
      console.error('Error saving product:', error);

      toast.error(
        error?.message || 'Failed to save product'
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // DELETE
  // =========================
  const handleDelete = async (product) => {
    const confirmed = window.confirm(
      `Delete product "${product.title}"?`
    );

    if (!confirmed) return;

    setDeleting(product.id);

    try {
      await deleteDoc(
        doc(db, 'products', product.id)
      );

      toast.success('Product deleted successfully');

      await fetchProducts();

    } catch (error) {
      console.error('Error deleting product:', error);

      toast.error(
        error?.message || 'Failed to delete product'
      );
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div>

      {/* =========================
          HEADER
      ========================= */}
      <div className="flex justify-between items-center mb-8">

        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Manage Products
          </h1>

          <p className="text-slate-500">
            Manage your product catalog.
          </p>
        </div>

        <button
          type="button"
          onClick={() => handleOpenModal()}
          className="bg-sky text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-sky/90 transition-colors"
        >
          <MdAdd />
          Add Product
        </button>

      </div>

      {/* =========================
          PRODUCTS TABLE
      ========================= */}
      {loading ? (

        <div className="flex justify-center p-12">

          <div className="w-8 h-8 border-4 border-sky border-t-transparent rounded-full animate-spin"></div>

        </div>

      ) : (

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">

          <table className="w-full text-left">

            <thead className="bg-slate-50 border-b border-slate-100">

              <tr>

                <th className="px-6 py-4 text-sm font-semibold text-slate-600">
                  Image
                </th>

                <th className="px-6 py-4 text-sm font-semibold text-slate-600">
                  Title
                </th>

                <th className="px-6 py-4 text-sm font-semibold text-slate-600">
                  Category
                </th>

                <th className="px-6 py-4 text-sm font-semibold text-slate-600 text-right">
                  Actions
                </th>

              </tr>

            </thead>

            <tbody className="divide-y divide-slate-100">

              {products.map((product) => (

                <tr
                  key={product.id}
                  className="hover:bg-slate-50"
                >

                  {/* IMAGE */}
                  <td className="px-6 py-4">

                    {product.image ? (

                      <img
                        src={product.image}
                        alt={product.title || 'Product'}
                        className="w-12 h-12 object-cover rounded-lg shadow-sm"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />

                    ) : (

                      <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400">
                        N/A
                      </div>

                    )}

                  </td>

                  {/* TITLE */}
                  <td className="px-6 py-4 font-medium text-slate-800">
                    {product.title}
                  </td>

                  {/* CATEGORY */}
                  <td className="px-6 py-4 text-slate-600">

                    <span className="px-2 py-1 bg-sky/10 text-sky text-xs rounded-full">
                      {product.category}
                    </span>

                  </td>

                  {/* ACTIONS */}
                  <td className="px-6 py-4 text-right">

                    <button
                      type="button"
                      disabled={deleting === product.id}
                      onClick={() => handleOpenModal(product)}
                      className="text-slate-400 hover:text-sky p-2 disabled:opacity-50"
                    >
                      <MdEdit className="text-lg" />
                    </button>

                    <button
                      type="button"
                      disabled={deleting === product.id}
                      onClick={() => handleDelete(product)}
                      className="text-slate-400 hover:text-red-500 p-2 ml-2 disabled:opacity-50"
                    >

                      {deleting === product.id ? (

                        <span className="inline-block w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin"></span>

                      ) : (

                        <MdDelete className="text-lg" />

                      )}

                    </button>

                  </td>

                </tr>

              ))}

              {products.length === 0 && (

                <tr>

                  <td
                    colSpan="4"
                    className="px-6 py-12 text-center text-slate-400"
                  >
                    No products found.
                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>

      )}

      {/* =========================
          MODAL
      ========================= */}
      {isModalOpen && (

        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              handleCloseModal();
            }
          }}
        >

          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl pointer-events-auto relative z-20">

            {/* MODAL HEADER */}
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white z-10">

              <h3 className="font-bold text-slate-800">
                {editingId ? 'Edit Product' : 'Add Product'}
              </h3>

              <button
                type="button"
                disabled={saving}
                onClick={handleCloseModal}
                className="text-slate-400 hover:text-slate-600 disabled:opacity-50"
              >
                <MdClose className="text-xl" />
              </button>

            </div>

            {/* FORM */}
            <form
              onSubmit={handleSubmit}
              className="p-6 space-y-4"
            >

              {/* TITLE + CATEGORY */}
              <div className="grid grid-cols-2 gap-4">

                <div>

                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Title
                  </label>

                  <input
                    type="text"
                    name="title"
                    required
                    disabled={saving}
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Product title"
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky/50 disabled:opacity-60"
                  />

                </div>

                <div>

                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Category
                  </label>

                  <input
                    type="text"
                    name="category"
                    required
                    disabled={saving}
                    value={formData.category}
                    onChange={handleChange}
                    placeholder="Product category"
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky/50 disabled:opacity-60"
                  />

                </div>

              </div>

              {/* IMAGE URL */}
              <div>

                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Image URL
                </label>

                <input
                  type="url"
                  name="image"
                  disabled={saving}
                  value={formData.image}
                  onChange={handleChange}
                  placeholder="Paste image URL here"
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky/50 disabled:opacity-60"
                />

                {/* IMAGE PREVIEW */}
                {formData.image && !imageError && (

                  <div className="mt-3 border border-slate-200 rounded-lg p-2 bg-slate-50">

                    <img
                      src={formData.image}
                      alt="Product preview"
                      className="w-full h-40 object-cover rounded-lg"
                      onError={() => setImageError(true)}
                    />

                  </div>

                )}

                {imageError && (

                  <p className="mt-2 text-sm text-red-500">
                    Invalid image URL. Please check the URL.
                  </p>

                )}

              </div>

              {/* DESCRIPTION */}
              <div>

                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Description
                </label>

                <textarea
                  name="description"
                  required
                  disabled={saving}
                  rows="3"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Product description"
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky/50 disabled:opacity-60"
                />

              </div>

              {/* SPECIFICATIONS */}
              <div>

                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Specifications (comma separated)
                </label>

                <input
                  type="text"
                  name="specifications"
                  disabled={saving}
                  value={formData.specifications}
                  onChange={handleChange}
                  placeholder="e.g. Thickness 10mm, Clear Glass"
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky/50 disabled:opacity-60"
                />

              </div>

              {/* APPLICATIONS */}
              <div>

                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Applications (comma separated)
                </label>

                <input
                  type="text"
                  name="applications"
                  disabled={saving}
                  value={formData.applications}
                  onChange={handleChange}
                  placeholder="e.g. Doors, Windows"
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky/50 disabled:opacity-60"
                />

              </div>

              {/* BUTTONS */}
              <div className="pt-4 flex justify-end gap-3 sticky bottom-0 bg-white border-t border-slate-100 mt-6 py-4 z-10">

                <button
                  type="button"
                  disabled={saving}
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 bg-sky hover:bg-sky/90 text-white rounded-lg font-medium flex items-center gap-2 min-w-[120px] justify-center disabled:opacity-50"
                >

                  {saving ? (

                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      {editingId ? 'Updating...' : 'Saving...'}
                    </>

                  ) : (

                    editingId ? 'Update' : 'Save'

                  )}

                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}