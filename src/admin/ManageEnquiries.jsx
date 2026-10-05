import { useState, useEffect } from 'react';
import { collection, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { MdDelete, MdMail } from 'react-icons/md';
import toast from 'react-hot-toast';

export default function ManageEnquiries() {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const [updating, setUpdating] = useState(null);

  const fetchEnquiries = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'enquiries'));
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      // Sort by date descending
      data.sort((a, b) => {
        if (!a.createdAt || !b.createdAt) return 0;
        return b.createdAt.toMillis() - a.createdAt.toMillis();
      });
      setEnquiries(data);
    } catch (error) {
      console.error("Error fetching enquiries:", error);
      toast.error('Failed to load enquiries');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Delete this enquiry permanently?')) {
      setDeleting(id);
      try {
        await deleteDoc(doc(db, 'enquiries', id));
        toast.success('Enquiry deleted');
        fetchEnquiries();
      } catch (error) {
        console.error("Error deleting enquiry:", error);
        toast.error('Delete failed');
      } finally {
        setDeleting(null);
      }
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    setUpdating(id);
    try {
      await updateDoc(doc(db, 'enquiries', id), { status: newStatus });
      toast.success('Status updated');
      fetchEnquiries();
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error('Update failed');
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Manage Enquiries</h1>
          <p className="text-slate-500">View and delete customer quotes and messages.</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <div className="w-8 h-8 border-4 border-sky border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Contact</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Date & Status</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Project Type & Message</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {enquiries.map((enq) => (
                <tr key={enq.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <p className="font-medium text-slate-800">{enq.fullName || enq.name}</p>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-1"><MdMail /> {enq.email}</p>
                    <p className="text-xs text-slate-500 mt-1">{enq.phone}</p>
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    <p className="text-xs text-slate-500 mb-2">
                      {enq.createdAt ? new Date(enq.createdAt.toDate()).toLocaleDateString() : 'N/A'}
                    </p>
                    <div className="relative">
                      <select
                        value={enq.status || 'new'}
                        disabled={updating === enq.id}
                        onChange={(e) => handleStatusChange(enq.id, e.target.value)}
                        className="text-xs px-2 py-1 rounded border border-slate-200 bg-white disabled:opacity-50"
                      >
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                      </select>
                      {updating === enq.id && (
                        <span className="absolute -right-4 top-1.5 w-3 h-3 border-2 border-sky border-t-transparent rounded-full animate-spin"></span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600 text-sm max-w-sm">
                    <span className="inline-block px-2 py-1 bg-sky/10 text-sky text-xs rounded-full mb-2">{enq.projectType || enq.subject || 'General'}</span>
                    {(enq.productName || enq.productCategory) && (
                      <div className="text-xs text-slate-500 mb-1">
                        <strong>Product:</strong> {enq.productName} ({enq.productCategory})
                      </div>
                    )}
                    <p>{enq.projectDetails || enq.message}</p>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button type="button" disabled={deleting === enq.id} onClick={() => handleDelete(enq.id)} className="text-slate-400 hover:text-red-500 p-2 disabled:opacity-50">
                      {deleting === enq.id ? <span className="inline-block w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin"></span> : <MdDelete className="text-lg" />}
                    </button>
                  </td>
                </tr>
              ))}
              {enquiries.length === 0 && (
                <tr><td colSpan="4" className="px-6 py-12 text-center text-slate-400">No enquiries found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

