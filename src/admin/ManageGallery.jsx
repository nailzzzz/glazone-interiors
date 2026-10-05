import { useState, useEffect } from 'react';
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  updateDoc
} from 'firebase/firestore';

import { db, auth } from '../firebase/firebase';

import {
  MdAdd,
  MdEdit,
  MdDelete,
  MdClose
} from 'react-icons/md';

import toast from 'react-hot-toast';

export default function ManageGallery() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);

  const [imageError, setImageError] = useState(false);

  const [formData, setFormData] = useState({
    category: '',
    span: 'col-span-1 row-span-1',
    src: ''
  });

  // =========================================================
  // FETCH GALLERY
  // =========================================================

  const fetchImages = async () => {
    try {
      setLoading(true);

      const querySnapshot = await getDocs(
        collection(db, 'gallery')
      );

      /*
       * IMPORTANT:
       * Firestore document ID is placed LAST.
       *
       * This prevents an "id" field inside the
       * Firestore document from overwriting the
       * actual Firestore document ID.
       */

      const data = querySnapshot.docs.map((galleryDoc) => ({
        ...galleryDoc.data(),
        id: String(galleryDoc.id)
      }));

      setImages(data);

      console.log('Gallery loaded:', data);

    } catch (error) {
      console.error(
        'ERROR FETCHING GALLERY:',
        error
      );

      setImages([]);

      if (error?.code === 'permission-denied') {
        toast.error(
          'Permission denied. Check Firestore Rules.'
        );
      } else {
        toast.error(
          error?.message ||
          'Failed to load gallery.'
        );
      }

    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // LOAD GALLERY
  // =========================================================

  useEffect(() => {
    fetchImages();
  }, []);

  // =========================================================
  // OPEN ADD / EDIT MODAL
  // =========================================================

  const handleOpenModal = (img = null) => {
    setImageError(false);

    if (img) {
      // -----------------------------------------------------
      // EDIT IMAGE
      // -----------------------------------------------------

      const galleryId = String(img.id);

      console.log(
        'Opening gallery image for edit:',
        galleryId
      );

      setEditingId(galleryId);

      setFormData({
        category: img.category || '',
        span: img.span || 'col-span-1 row-span-1',
        src: img.src || ''
      });

    } else {
      // -----------------------------------------------------
      // ADD IMAGE
      // -----------------------------------------------------

      setEditingId(null);

      setFormData({
        category: '',
        span: 'col-span-1 row-span-1',
        src: ''
      });
    }

    setIsModalOpen(true);
  };

  // =========================================================
  // CLOSE MODAL
  // =========================================================

  const handleCloseModal = () => {
    if (saving) return;

    setIsModalOpen(false);
    setEditingId(null);
    setImageError(false);

    setFormData({
      category: '',
      span: 'col-span-1 row-span-1',
      src: ''
    });
  };

  // =========================================================
  // HANDLE INPUT
  // =========================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'src') {
      setImageError(false);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // =========================================================
  // SAVE / UPDATE IMAGE
  // =========================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (saving) return;

    // -------------------------------------------------------
    // CHECK LOGIN
    // -------------------------------------------------------

    if (!auth.currentUser) {
      toast.error(
        'You are not logged in. Please login again.'
      );
      return;
    }

    // -------------------------------------------------------
    // CLEAN DATA
    // -------------------------------------------------------

    const category = formData.category.trim();
    const span = formData.span.trim();
    const src = formData.src.trim();

    // -------------------------------------------------------
    // VALIDATION
    // -------------------------------------------------------

    if (!category) {
      toast.error(
        'Please enter a category.'
      );
      return;
    }

    if (!span) {
      toast.error(
        'Please enter grid span.'
      );
      return;
    }

    if (!src) {
      toast.error(
        'Please enter an image URL.'
      );
      return;
    }

    setSaving(true);

    try {

      // -----------------------------------------------------
      // GALLERY DATA
      // -----------------------------------------------------

      const galleryData = {
        category,
        span,
        src
      };

      console.log(
        'Saving gallery image:',
        galleryData
      );

      // -----------------------------------------------------
      // UPDATE EXISTING IMAGE
      // -----------------------------------------------------

      if (editingId) {

        const galleryId = String(
          editingId
        );

        console.log(
          'Updating gallery ID:',
          galleryId
        );

        console.log(
          'Gallery ID type:',
          typeof galleryId
        );

        await updateDoc(
          doc(
            db,
            'gallery',
            galleryId
          ),
          galleryData
        );

        toast.success(
          'Image updated successfully!'
        );

      } else {

        // ---------------------------------------------------
        // ADD NEW IMAGE
        // ---------------------------------------------------

        console.log(
          'Adding new gallery image...'
        );

        await addDoc(
          collection(db, 'gallery'),
          galleryData
        );

        toast.success(
          'Image added successfully!'
        );
      }

      // -----------------------------------------------------
      // RESET MODAL
      // -----------------------------------------------------

      setIsModalOpen(false);
      setEditingId(null);
      setImageError(false);

      setFormData({
        category: '',
        span: 'col-span-1 row-span-1',
        src: ''
      });

      // -----------------------------------------------------
      // REFRESH GALLERY
      // -----------------------------------------------------

      await fetchImages();

    } catch (error) {

      console.error(
        '================================'
      );

      console.error(
        'ERROR SAVING GALLERY IMAGE:',
        error
      );

      console.error(
        'ERROR CODE:',
        error?.code
      );

      console.error(
        'ERROR MESSAGE:',
        error?.message
      );

      console.error(
        '================================'
      );

      if (
        error?.code ===
        'permission-denied'
      ) {

        toast.error(
          'Permission denied. Check Firestore Rules.'
        );

      } else if (
        error?.code ===
        'not-found'
      ) {

        toast.error(
          'Gallery image was not found in Firebase.'
        );

      } else {

        toast.error(
          error?.message ||
          'Failed to save image.'
        );

      }

    } finally {
      setSaving(false);
    }
  };

  // =========================================================
  // DELETE IMAGE
  // =========================================================

  const handleDelete = async (img) => {

    if (deleting) return;

    // -------------------------------------------------------
    // CHECK LOGIN
    // -------------------------------------------------------

    if (!auth.currentUser) {
      toast.error(
        'Please login again.'
      );
      return;
    }

    // -------------------------------------------------------
    // CONFIRM DELETE
    // -------------------------------------------------------

    const confirmed = window.confirm(
      'Delete this gallery image?'
    );

    if (!confirmed) return;

    const galleryId = String(
      img.id
    );

    console.log(
      'Deleting gallery ID:',
      galleryId
    );

    console.log(
      'Gallery ID type:',
      typeof galleryId
    );

    setDeleting(galleryId);

    try {

      // -----------------------------------------------------
      // DELETE FIRESTORE DOCUMENT
      // -----------------------------------------------------
      // Firebase Storage is NOT used.

      await deleteDoc(
        doc(
          db,
          'gallery',
          galleryId
        )
      );

      toast.success(
        'Image deleted successfully!'
      );

      // -----------------------------------------------------
      // REFRESH
      // -----------------------------------------------------

      await fetchImages();

    } catch (error) {

      console.error(
        'ERROR DELETING GALLERY IMAGE:',
        error
      );

      if (
        error?.code ===
        'permission-denied'
      ) {

        toast.error(
          'Permission denied. Check Firestore Rules.'
        );

      } else if (
        error?.code ===
        'not-found'
      ) {

        toast.error(
          'Gallery image was not found in Firebase.'
        );

      } else {

        toast.error(
          error?.message ||
          'Failed to delete image.'
        );

      }

    } finally {
      setDeleting(null);
    }
  };

  // =========================================================
  // IMAGE ERROR
  // =========================================================

  const handleImageError = () => {
    setImageError(true);
  };

  // =========================================================
  // RETURN UI
  // =========================================================

  return (
    <div>

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="flex justify-between items-center mb-8">

        <div>

          <h1 className="text-2xl font-bold text-slate-800">
            Manage Gallery
          </h1>

          <p className="text-slate-500">
            Add, edit, or remove gallery images.
          </p>

        </div>

        <button
          type="button"
          onClick={() => handleOpenModal()}
          className="bg-sky text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-sky/90 transition-colors"
        >

          <MdAdd />

          Add Image

        </button>

      </div>


      {/* =====================================================
          LOADING
      ===================================================== */}

      {loading ? (

        <div className="flex justify-center p-12">

          <div className="w-8 h-8 border-4 border-sky border-t-transparent rounded-full animate-spin"></div>

        </div>

      ) : (

        /* ===================================================
           GALLERY TABLE
        =================================================== */

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">

          <div className="overflow-x-auto">

            <table className="w-full text-left">

              <thead className="bg-slate-50 border-b border-slate-100">

                <tr>

                  <th className="px-6 py-4 text-sm font-semibold text-slate-600">
                    Image
                  </th>

                  <th className="px-6 py-4 text-sm font-semibold text-slate-600">
                    Category
                  </th>

                  <th className="px-6 py-4 text-sm font-semibold text-slate-600">
                    Grid Span
                  </th>

                  <th className="px-6 py-4 text-sm font-semibold text-slate-600 text-right">
                    Actions
                  </th>

                </tr>

              </thead>


              <tbody className="divide-y divide-slate-100">

                {images.map((img) => {

                  const galleryId =
                    String(img.id);

                  return (

                    <tr
                      key={galleryId}
                      className="hover:bg-slate-50 transition-colors"
                    >

                      {/* IMAGE */}

                      <td className="px-6 py-4">

                        {img.src ? (

                          <img
                            src={img.src}
                            alt={
                              img.category ||
                              'Gallery image'
                            }
                            className="w-16 h-16 object-cover rounded-lg shadow-sm"
                            onError={(e) => {
                              e.currentTarget.style.display =
                                'none';
                            }}
                          />

                        ) : (

                          <div className="w-16 h-16 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400">
                            N/A
                          </div>

                        )}

                      </td>


                      {/* CATEGORY */}

                      <td className="px-6 py-4">

                        <span className="px-2 py-1 bg-sky/10 text-sky text-xs rounded-full">
                          {img.category}
                        </span>

                      </td>


                      {/* GRID SPAN */}

                      <td className="px-6 py-4">

                        <code className="text-xs bg-slate-100 px-2 py-1 rounded">
                          {img.span}
                        </code>

                      </td>


                      {/* ACTIONS */}

                      <td className="px-6 py-4 text-right">

                        {/* EDIT */}

                        <button
                          type="button"
                          disabled={
                            deleting === galleryId ||
                            saving
                          }
                          onClick={() =>
                            handleOpenModal(img)
                          }
                          className="text-slate-400 hover:text-sky p-2 transition-colors disabled:opacity-50"
                          title="Edit Image"
                        >

                          <MdEdit className="text-lg" />

                        </button>


                        {/* DELETE */}

                        <button
                          type="button"
                          disabled={
                            deleting === galleryId ||
                            saving
                          }
                          onClick={() =>
                            handleDelete(img)
                          }
                          className="text-slate-400 hover:text-red-500 p-2 ml-2 transition-colors disabled:opacity-50"
                          title="Delete Image"
                        >

                          {deleting === galleryId ? (

                            <span className="inline-block w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin"></span>

                          ) : (

                            <MdDelete className="text-lg" />

                          )}

                        </button>

                      </td>

                    </tr>

                  );
                })}


                {/* EMPTY STATE */}

                {images.length === 0 && (

                  <tr>

                    <td
                      colSpan="4"
                      className="px-6 py-12 text-center text-slate-400"
                    >

                      No images found. Add an image to get started.

                    </td>

                  </tr>

                )}

              </tbody>

            </table>

          </div>

        </div>

      )}


      {/* =====================================================
          ADD / EDIT MODAL
      ===================================================== */}

      {isModalOpen && (

        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onMouseDown={(e) => {

            if (
              e.target ===
              e.currentTarget &&
              !saving
            ) {
              handleCloseModal();
            }

          }}
        >

          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl pointer-events-auto relative z-20">

            {/* =================================================
                MODAL HEADER
            ================================================= */}

            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50 sticky top-0 z-10">

              <h3 className="font-bold text-slate-800">

                {editingId
                  ? 'Edit Image'
                  : 'Add Image'}

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


            {/* =================================================
                FORM
            ================================================= */}

            <form
              onSubmit={handleSubmit}
              className="p-6 space-y-4"
            >

              {/* CATEGORY */}

              <div>

                <label
                  htmlFor="gallery-category"
                  className="block text-sm font-medium text-slate-700 mb-1"
                >
                  Category
                </label>

                <input
                  id="gallery-category"
                  type="text"
                  name="category"
                  placeholder="e.g. Glass"
                  required
                  autoComplete="off"
                  disabled={saving}
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky/50 focus:border-sky disabled:opacity-60"
                />

              </div>


              {/* GRID SPAN */}

              <div>

                <label
                  htmlFor="gallery-span"
                  className="block text-sm font-medium text-slate-700 mb-1"
                >
                  Grid Span
                </label>

                <input
                  id="gallery-span"
                  type="text"
                  name="span"
                  placeholder="e.g. col-span-2 row-span-2"
                  required
                  disabled={saving}
                  value={formData.span}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky/50 focus:border-sky disabled:opacity-60"
                />

              </div>


              {/* IMAGE URL */}

              <div>

                <label
                  htmlFor="gallery-image-url"
                  className="block text-sm font-medium text-slate-700 mb-1"
                >
                  Image URL
                </label>

                <input
                  id="gallery-image-url"
                  type="url"
                  name="src"
                  placeholder="Paste image URL here"
                  required
                  disabled={saving}
                  value={formData.src}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky/50 focus:border-sky disabled:opacity-60"
                />

                <p className="text-xs text-slate-400 mt-2">
                  Paste a direct image URL. Firebase Storage is not required.
                </p>

              </div>


              {/* IMAGE PREVIEW */}

              {formData.src &&
                !imageError && (

                  <div className="border border-slate-200 rounded-lg p-2 bg-slate-50">

                    <img
                      src={formData.src}
                      alt="Gallery preview"
                      className="w-full h-48 object-cover rounded-lg"
                      onError={
                        handleImageError
                      }
                    />

                  </div>

                )}


              {/* IMAGE ERROR */}

              {imageError && (

                <p className="text-sm text-red-500">
                  Invalid image URL. Please check the URL.
                </p>

              )}


              {/* BUTTONS */}

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">

                {/* CANCEL */}

                <button
                  type="button"
                  onClick={handleCloseModal}
                  disabled={saving}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium transition-colors disabled:opacity-50"
                >

                  Cancel

                </button>


                {/* SAVE / UPDATE */}

                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 bg-sky hover:bg-sky/90 text-white rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center gap-2 min-w-[130px] justify-center"
                >

                  {saving ? (

                    <>

                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>

                      {editingId
                        ? 'Updating...'
                        : 'Saving...'}

                    </>

                  ) : (

                    editingId
                      ? 'Update Image'
                      : 'Save Image'

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