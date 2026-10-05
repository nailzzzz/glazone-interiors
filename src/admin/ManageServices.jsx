import { useState, useEffect } from 'react';
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  serverTimestamp
} from 'firebase/firestore';

import { db, auth } from '../firebase/firebase';

import {
  MdAdd,
  MdEdit,
  MdDelete,
  MdClose
} from 'react-icons/md';

import toast from 'react-hot-toast';

export default function ManageServices() {
  const [services, setServices] = useState([]);
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
    image: ''
  });

  // =========================================================
  // FETCH SERVICES
  // =========================================================

  const fetchServices = async () => {
    try {
      setLoading(true);

      const snapshot = await getDocs(
        collection(db, 'services')
      );

      /*
       * IMPORTANT:
       * Keep Firestore document ID LAST.
       *
       * This prevents an existing "id" field inside
       * the Firestore document from overwriting the
       * real Firestore document ID.
       */

      const data = snapshot.docs.map((item) => ({
        ...item.data(),
        id: String(item.id)
      }));

      setServices(data);

      console.log('Services loaded:', data);

    } catch (error) {
      console.error(
        'FETCH SERVICES ERROR:',
        error
      );

      setServices([]);

      if (error?.code === 'permission-denied') {
        toast.error(
          'Permission denied. Please check Firestore Rules.'
        );
      } else {
        toast.error(
          error?.message ||
          'Unable to load services.'
        );
      }

    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // LOAD SERVICES
  // =========================================================

  useEffect(() => {
    fetchServices();
  }, []);

  // =========================================================
  // OPEN ADD / EDIT MODAL
  // =========================================================

  const handleOpenModal = (service = null) => {
    setImageError(false);

    if (service) {
      // EDIT SERVICE

      setEditingId(
        String(service.id)
      );

      setFormData({
        title: service.title || '',
        category: service.category || '',
        description: service.description || '',
        image: service.image || ''
      });

    } else {
      // ADD NEW SERVICE

      setEditingId(null);

      setFormData({
        title: '',
        category: '',
        description: '',
        image: ''
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
      title: '',
      category: '',
      description: '',
      image: ''
    });
  };

  // =========================================================
  // HANDLE INPUT CHANGE
  // =========================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Reset image error when URL changes
    if (name === 'image') {
      setImageError(false);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // =========================================================
  // SAVE / UPDATE SERVICE
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
    // CLEAN FORM DATA
    // -------------------------------------------------------

    const title = formData.title.trim();
    const category = formData.category.trim();
    const description = formData.description.trim();
    const image = formData.image.trim();

    // -------------------------------------------------------
    // VALIDATION
    // -------------------------------------------------------

    if (!title) {
      toast.error(
        'Please enter the service title.'
      );
      return;
    }

    if (!category) {
      toast.error(
        'Please enter the category.'
      );
      return;
    }

    if (!description) {
      toast.error(
        'Please enter the description.'
      );
      return;
    }

    if (!image) {
      toast.error(
        'Please enter an image URL.'
      );
      return;
    }

    setSaving(true);

    try {
      // -----------------------------------------------------
      // SERVICE DATA
      // -----------------------------------------------------

      const serviceData = {
        title: title,
        category: category,
        description: description,
        image: image
      };

      console.log(
        'Saving service to Firestore:',
        serviceData
      );

      // -----------------------------------------------------
      // UPDATE EXISTING SERVICE
      // -----------------------------------------------------

      if (editingId) {
        const serviceId = String(editingId);

        console.log(
          'Updating service ID:',
          serviceId
        );

        console.log(
          'Service ID type:',
          typeof serviceId
        );

        await updateDoc(
          doc(
            db,
            'services',
            serviceId
          ),
          serviceData
        );

        toast.success(
          'Service updated successfully!'
        );

      } else {
        // ---------------------------------------------------
        // ADD NEW SERVICE
        // ---------------------------------------------------

        console.log(
          'Adding new service...'
        );

        await addDoc(
          collection(db, 'services'),
          {
            ...serviceData,
            createdAt: serverTimestamp()
          }
        );

        toast.success(
          'Service added successfully!'
        );
      }

      // -----------------------------------------------------
      // RESET MODAL
      // -----------------------------------------------------

      setIsModalOpen(false);
      setEditingId(null);
      setImageError(false);

      setFormData({
        title: '',
        category: '',
        description: '',
        image: ''
      });

      // -----------------------------------------------------
      // REFRESH SERVICES
      // -----------------------------------------------------

      await fetchServices();

    } catch (error) {
      console.error(
        '================================'
      );

      console.error(
        'SERVICE SAVE ERROR:',
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

      // -----------------------------------------------------
      // ERROR HANDLING
      // -----------------------------------------------------

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
          'Service was not found in Firebase.'
        );

      } else {
        toast.error(
          error?.message ||
          'Failed to save service.'
        );
      }

    } finally {
      setSaving(false);
    }
  };

  // =========================================================
  // DELETE SERVICE
  // =========================================================

  const handleDelete = async (service) => {
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
      `Are you sure you want to delete "${service.title}"?`
    );

    if (!confirmed) return;

    const serviceId = String(
      service.id
    );

    setDeleting(serviceId);

    try {
      console.log(
        'Deleting service ID:',
        serviceId
      );

      // -----------------------------------------------------
      // DELETE FIRESTORE DOCUMENT
      // -----------------------------------------------------
      // Firebase Storage is NOT used.

      await deleteDoc(
        doc(
          db,
          'services',
          serviceId
        )
      );

      toast.success(
        'Service deleted successfully!'
      );

      // -----------------------------------------------------
      // REFRESH LIST
      // -----------------------------------------------------

      await fetchServices();

    } catch (error) {
      console.error(
        'DELETE SERVICE ERROR:',
        error
      );

      if (
        error?.code ===
        'permission-denied'
      ) {
        toast.error(
          'Permission denied. Check Firestore Rules.'
        );
      } else {
        toast.error(
          error?.message ||
          'Failed to delete service.'
        );
      }

    } finally {
      setDeleting(null);
    }
  };

  // =========================================================
  // IMAGE PREVIEW ERROR
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
          PAGE HEADER
      ===================================================== */}

      <div className="flex justify-between items-center mb-8">

        <div>

          <h1 className="text-2xl font-bold text-slate-800">
            Manage Services
          </h1>

          <p className="text-slate-500">
            Add, edit, or remove services offered.
          </p>

        </div>

        <button
          type="button"
          onClick={() => handleOpenModal()}
          className="bg-sky text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-sky/90 transition-colors"
        >
          <MdAdd />
          Add Service
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
           SERVICES TABLE
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

                {services.map((service) => (

                  <tr
                    key={service.id}
                    className="hover:bg-slate-50 transition-colors"
                  >

                    {/* IMAGE */}

                    <td className="px-6 py-4">

                      {service.image ? (

                        <img
                          src={service.image}
                          alt={
                            service.title ||
                            'Service'
                          }
                          className="w-12 h-12 object-cover rounded-lg shadow-sm"
                          onError={(e) => {
                            e.currentTarget.style.display =
                              'none';
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
                      {service.title}
                    </td>


                    {/* CATEGORY */}

                    <td className="px-6 py-4 text-slate-600">

                      <span className="px-2 py-1 bg-sky/10 text-sky text-xs rounded-full">
                        {service.category}
                      </span>

                    </td>


                    {/* ACTIONS */}

                    <td className="px-6 py-4 text-right">

                      {/* EDIT */}

                      <button
                        type="button"
                        onClick={() =>
                          handleOpenModal(service)
                        }
                        disabled={
                          deleting ===
                          String(service.id)
                        }
                        className="text-slate-400 hover:text-sky p-2 transition-colors disabled:opacity-50"
                        title="Edit Service"
                      >

                        <MdEdit className="text-lg" />

                      </button>


                      {/* DELETE */}

                      <button
                        type="button"
                        onClick={() =>
                          handleDelete(service)
                        }
                        disabled={
                          deleting ===
                          String(service.id)
                        }
                        className="text-slate-400 hover:text-red-500 p-2 transition-colors ml-2 disabled:opacity-50"
                        title="Delete Service"
                      >

                        {deleting ===
                          String(service.id) ? (

                          <span className="inline-block w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin"></span>

                        ) : (

                          <MdDelete className="text-lg" />

                        )}

                      </button>

                    </td>

                  </tr>

                ))}


                {/* EMPTY STATE */}

                {services.length === 0 && (

                  <tr>

                    <td
                      colSpan="4"
                      className="px-6 py-12 text-center text-slate-400"
                    >
                      No services found. Add a service to get started.
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

            {/* MODAL HEADER */}

            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50 sticky top-0 z-10">

              <h3 className="font-bold text-slate-800">

                {editingId
                  ? 'Edit Service'
                  : 'Add New Service'}

              </h3>


              <button
                type="button"
                onClick={handleCloseModal}
                disabled={saving}
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

              {/* TITLE */}

              <div>

                <label
                  htmlFor="service-title"
                  className="block text-sm font-medium text-slate-700 mb-1"
                >
                  Title
                </label>

                <input
                  id="service-title"
                  type="text"
                  name="title"
                  required
                  autoComplete="off"
                  disabled={saving}
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter service title"
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky/50 focus:border-sky disabled:opacity-60"
                />

              </div>


              {/* CATEGORY */}

              <div>

                <label
                  htmlFor="service-category"
                  className="block text-sm font-medium text-slate-700 mb-1"
                >
                  Category
                </label>

                <input
                  id="service-category"
                  type="text"
                  name="category"
                  required
                  autoComplete="off"
                  disabled={saving}
                  value={formData.category}
                  onChange={handleChange}
                  placeholder="Enter service category"
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky/50 focus:border-sky disabled:opacity-60"
                />

              </div>


              {/* IMAGE URL */}

              <div>

                <label
                  htmlFor="service-image-url"
                  className="block text-sm font-medium text-slate-700 mb-1"
                >
                  Image URL
                </label>

                <input
                  id="service-image-url"
                  type="url"
                  name="image"
                  required
                  disabled={saving}
                  value={formData.image}
                  onChange={handleChange}
                  placeholder="Paste image URL here"
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky/50 focus:border-sky disabled:opacity-60"
                />

                <p className="text-xs text-slate-400 mt-2">
                  Paste a direct image URL. Firebase Storage is not required.
                </p>

              </div>


              {/* IMAGE PREVIEW */}

              {formData.image &&
                !imageError && (

                  <div className="border border-slate-200 rounded-lg p-2 bg-slate-50">

                    <img
                      src={formData.image}
                      alt="Service preview"
                      className="w-full h-40 object-cover rounded-lg"
                      onError={
                        handleImageError
                      }
                    />

                  </div>

                )}


              {/* INVALID IMAGE */}

              {imageError && (

                <p className="text-sm text-red-500">
                  Invalid image URL. Please check the URL.
                </p>

              )}


              {/* DESCRIPTION */}

              <div>

                <label
                  htmlFor="service-description"
                  className="block text-sm font-medium text-slate-700 mb-1"
                >
                  Description
                </label>

                <textarea
                  id="service-description"
                  name="description"
                  required
                  rows="3"
                  disabled={saving}
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter service description"
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky/50 focus:border-sky resize-none disabled:opacity-60"
                />

              </div>


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
                      ? 'Update Service'
                      : 'Save Service'

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