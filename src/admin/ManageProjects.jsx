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

export default function ManageProjects() {
  const [projects, setProjects] = useState([]);
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
  // FETCH PROJECTS
  // =========================================================

  const fetchProjects = async () => {
    try {
      setLoading(true);

      const querySnapshot = await getDocs(
        collection(db, 'projects')
      );

      /*
       * IMPORTANT:
       * Firestore document ID is kept LAST.
       *
       * This prevents any "id" field stored inside
       * the document from overwriting the real
       * Firestore document ID.
       */

      const data = querySnapshot.docs.map((projectDoc) => ({
        ...projectDoc.data(),
        id: String(projectDoc.id)
      }));

      setProjects(data);

      console.log('Projects loaded:', data);

    } catch (error) {
      console.error(
        'ERROR FETCHING PROJECTS:',
        error
      );

      setProjects([]);

      if (error?.code === 'permission-denied') {
        toast.error(
          'Permission denied. Check Firestore Rules.'
        );
      } else {
        toast.error(
          error?.message ||
          'Failed to load projects.'
        );
      }

    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // LOAD PROJECTS
  // =========================================================

  useEffect(() => {
    fetchProjects();
  }, []);

  // =========================================================
  // OPEN ADD / EDIT MODAL
  // =========================================================

  const handleOpenModal = (project = null) => {
    setImageError(false);

    if (project) {
      // EDIT

      const projectId = String(
        project.id
      );

      console.log(
        'Opening project for edit:',
        projectId
      );

      setEditingId(projectId);

      setFormData({
        title: project.title || '',
        category: project.category || '',
        description: project.description || '',
        image: project.image || ''
      });

    } else {
      // ADD

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
  // INPUT CHANGE
  // =========================================================

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

  // =========================================================
  // SAVE / UPDATE PROJECT
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
    // VALIDATION
    // -------------------------------------------------------

    const title = formData.title.trim();
    const category = formData.category.trim();
    const description = formData.description.trim();
    const image = formData.image.trim();

    if (!title) {
      toast.error(
        'Please enter project title.'
      );
      return;
    }

    if (!category) {
      toast.error(
        'Please enter project category.'
      );
      return;
    }

    if (!description) {
      toast.error(
        'Please enter project description.'
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
      // PROJECT DATA
      // -----------------------------------------------------

      const projectData = {
        title,
        category,
        description,
        image
      };

      console.log(
        'Saving project:',
        projectData
      );

      // -----------------------------------------------------
      // UPDATE EXISTING PROJECT
      // -----------------------------------------------------

      if (editingId) {

        const projectId = String(
          editingId
        );

        console.log(
          'Updating project ID:',
          projectId
        );

        console.log(
          'Project ID type:',
          typeof projectId
        );

        await updateDoc(
          doc(
            db,
            'projects',
            projectId
          ),
          projectData
        );

        toast.success(
          'Project updated successfully!'
        );

      } else {

        // ---------------------------------------------------
        // ADD NEW PROJECT
        // ---------------------------------------------------

        console.log(
          'Adding new project...'
        );

        await addDoc(
          collection(db, 'projects'),
          projectData
        );

        toast.success(
          'Project added successfully!'
        );
      }

      // -----------------------------------------------------
      // RESET FORM
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
      // REFRESH PROJECTS
      // -----------------------------------------------------

      await fetchProjects();

    } catch (error) {

      console.error(
        '================================'
      );

      console.error(
        'ERROR SAVING PROJECT:',
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
          'Project was not found in Firebase.'
        );

      } else {

        toast.error(
          error?.message ||
          'Failed to save project.'
        );

      }

    } finally {
      setSaving(false);
    }
  };

  // =========================================================
  // DELETE PROJECT
  // =========================================================

  const handleDelete = async (project) => {

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
    // CONFIRM
    // -------------------------------------------------------

    const confirmed = window.confirm(
      `Delete project "${project.title}"?`
    );

    if (!confirmed) return;

    const projectId = String(
      project.id
    );

    console.log(
      'Deleting project ID:',
      projectId
    );

    console.log(
      'Project ID type:',
      typeof projectId
    );

    setDeleting(projectId);

    try {

      // -----------------------------------------------------
      // DELETE FIRESTORE DOCUMENT
      // -----------------------------------------------------

      await deleteDoc(
        doc(
          db,
          'projects',
          projectId
        )
      );

      toast.success(
        'Project deleted successfully!'
      );

      // -----------------------------------------------------
      // REFRESH
      // -----------------------------------------------------

      await fetchProjects();

    } catch (error) {

      console.error(
        'ERROR DELETING PROJECT:',
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
          'Project was not found in Firebase.'
        );

      } else {

        toast.error(
          error?.message ||
          'Failed to delete project.'
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
            Manage Projects
          </h1>

          <p className="text-slate-500">
            Add, edit, or remove projects.
          </p>

        </div>

        <button
          type="button"
          onClick={() => handleOpenModal()}
          className="bg-sky text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-sky/90 transition-colors"
        >

          <MdAdd />

          Add Project

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
           PROJECT TABLE
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

                {projects.map((project) => {

                  const projectId =
                    String(project.id);

                  return (

                    <tr
                      key={projectId}
                      className="hover:bg-slate-50 transition-colors"
                    >

                      {/* IMAGE */}

                      <td className="px-6 py-4">

                        {project.image ? (

                          <img
                            src={project.image}
                            alt={
                              project.title ||
                              'Project'
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
                        {project.title}
                      </td>


                      {/* CATEGORY */}

                      <td className="px-6 py-4 text-slate-600">

                        <span className="px-2 py-1 bg-sky/10 text-sky text-xs rounded-full">
                          {project.category}
                        </span>

                      </td>


                      {/* ACTIONS */}

                      <td className="px-6 py-4 text-right">

                        {/* EDIT */}

                        <button
                          type="button"
                          disabled={
                            deleting === projectId ||
                            saving
                          }
                          onClick={() =>
                            handleOpenModal(project)
                          }
                          className="text-slate-400 hover:text-sky p-2 transition-colors disabled:opacity-50"
                          title="Edit Project"
                        >

                          <MdEdit className="text-lg" />

                        </button>


                        {/* DELETE */}

                        <button
                          type="button"
                          disabled={
                            deleting === projectId ||
                            saving
                          }
                          onClick={() =>
                            handleDelete(project)
                          }
                          className="text-slate-400 hover:text-red-500 p-2 ml-2 transition-colors disabled:opacity-50"
                          title="Delete Project"
                        >

                          {deleting === projectId ? (

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

                {projects.length === 0 && (

                  <tr>

                    <td
                      colSpan="4"
                      className="px-6 py-12 text-center text-slate-400"
                    >

                      No projects found. Add a project to get started.

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
                  ? 'Edit Project'
                  : 'Add New Project'}

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

              {/* TITLE */}

              <div>

                <label
                  htmlFor="project-title"
                  className="block text-sm font-medium text-slate-700 mb-1"
                >
                  Title
                </label>

                <input
                  id="project-title"
                  type="text"
                  name="title"
                  placeholder="Enter project title"
                  required
                  autoComplete="off"
                  disabled={saving}
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky/50 focus:border-sky disabled:opacity-60"
                />

              </div>


              {/* CATEGORY */}

              <div>

                <label
                  htmlFor="project-category"
                  className="block text-sm font-medium text-slate-700 mb-1"
                >
                  Category
                </label>

                <input
                  id="project-category"
                  type="text"
                  name="category"
                  placeholder="Enter project category"
                  required
                  autoComplete="off"
                  disabled={saving}
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky/50 focus:border-sky disabled:opacity-60"
                />

              </div>


              {/* IMAGE URL */}

              <div>

                <label
                  htmlFor="project-image"
                  className="block text-sm font-medium text-slate-700 mb-1"
                >
                  Image URL
                </label>

                <input
                  id="project-image"
                  type="url"
                  name="image"
                  placeholder="Paste image URL here"
                  required
                  disabled={saving}
                  value={formData.image}
                  onChange={handleChange}
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
                      alt="Project preview"
                      className="w-full h-40 object-cover rounded-lg"
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


              {/* DESCRIPTION */}

              <div>

                <label
                  htmlFor="project-description"
                  className="block text-sm font-medium text-slate-700 mb-1"
                >
                  Description
                </label>

                <textarea
                  id="project-description"
                  name="description"
                  placeholder="Enter project description"
                  required
                  disabled={saving}
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
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
                  className="px-4 py-2 bg-sky hover:bg-sky/90 text-white rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center gap-2 min-w-[140px] justify-center"
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
                      ? 'Update Project'
                      : 'Save Project'

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