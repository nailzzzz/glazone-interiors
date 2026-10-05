import { useEffect, useState } from 'react';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { sendPasswordResetEmail } from 'firebase/auth';
import { db, auth } from '../firebase/firebase';
import {
    MdSave,
    MdLock,
    MdBusiness,
    MdEmail,
    MdPhone,
    MdLocationOn,
    MdWhatsapp
} from 'react-icons/md';
import toast from 'react-hot-toast';

export default function Settings() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [resetting, setResetting] = useState(false);

    const [settings, setSettings] = useState({
        companyName: 'Glazone Interiors',
        phone: '8129842105',
        email: 'noushadma2008@gmail.com',
        whatsapp: '918129842105',
        address: 'Kottakkad Road, Keezhmad, Aluva, Ernakulam, Kerala'
    });

    useEffect(() => {
        const loadSettings = async () => {
            try {
                const settingsRef = doc(db, 'settings', 'company');
                const settingsSnap = await getDoc(settingsRef);

                if (settingsSnap.exists()) {
                    const data = settingsSnap.data();

                    setSettings((prev) => ({
                        companyName:
                            data.companyName !== undefined &&
                                String(data.companyName).trim() !== ''
                                ? String(data.companyName)
                                : prev.companyName,

                        phone:
                            data.phone !== undefined &&
                                String(data.phone).trim() !== ''
                                ? String(data.phone)
                                : prev.phone,

                        email:
                            data.email !== undefined &&
                                String(data.email).trim() !== ''
                                ? String(data.email)
                                : prev.email,

                        whatsapp:
                            data.whatsapp !== undefined &&
                                String(data.whatsapp).trim() !== ''
                                ? String(data.whatsapp)
                                : prev.whatsapp,

                        address:
                            data.address !== undefined &&
                                String(data.address).trim() !== ''
                                ? String(data.address)
                                : prev.address
                    }));
                }
            } catch (error) {
                console.error('Error loading settings:', error);
                toast.error('Unable to load settings');
            } finally {
                setLoading(false);
            }
        };

        loadSettings();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setSettings((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSave = async (e) => {
        e.preventDefault();

        setSaving(true);

        try {
            await setDoc(
                doc(db, 'settings', 'company'),
                {
                    companyName: settings.companyName.trim(),
                    phone: settings.phone.trim(),
                    email: settings.email.trim(),
                    whatsapp: settings.whatsapp.trim(),
                    address: settings.address.trim(),
                    updatedAt: serverTimestamp()
                },
                { merge: true }
            );

            toast.success('Settings saved successfully');
        } catch (error) {
            console.error('Error saving settings:', error);

            if (error.code === 'permission-denied') {
                toast.error('Permission denied. Check Firestore rules.');
            } else {
                toast.error('Failed to save settings');
            }
        } finally {
            setSaving(false);
        }
    };

    const handlePasswordReset = async () => {
        if (!auth.currentUser?.email) {
            toast.error('Admin email not found');
            return;
        }

        setResetting(true);

        try {
            await sendPasswordResetEmail(
                auth,
                auth.currentUser.email
            );

            toast.success(
                `Password reset link sent to ${auth.currentUser.email}`
            );
        } catch (error) {
            console.error('Password reset error:', error);
            toast.error('Unable to send password reset email');
        } finally {
            setResetting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-full">
                <div className="w-10 h-10 border-4 border-sky border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl">

            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-800">
                    Settings
                </h1>

                <p className="text-slate-500 mt-1">
                    Manage your Glazone website and admin account settings.
                </p>
            </div>

            {/* Company Settings */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 mb-6">

                <div className="px-6 py-5 border-b border-slate-100 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-sky/10 text-sky flex items-center justify-center">
                        <MdBusiness className="text-xl" />
                    </div>

                    <div>
                        <h2 className="font-bold text-slate-800">
                            Company Information
                        </h2>

                        <p className="text-sm text-slate-500">
                            Update the contact details shown on your website.
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSave} className="p-6">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                        {/* Company Name */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Company Name
                            </label>

                            <div className="relative">
                                <MdBusiness className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />

                                <input
                                    type="text"
                                    name="companyName"
                                    value={settings.companyName}
                                    onChange={handleChange}
                                    required
                                    disabled={saving}
                                    autoComplete="organization"
                                    className="w-full pl-10 pr-4 py-2.5 text-slate-800 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky/30 disabled:opacity-60 bg-white text-slate-900"
                                />
                            </div>
                        </div>

                        {/* Phone */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Phone Number
                            </label>

                            <div className="relative">
                                <MdPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />

                                <input
                                    type="tel"
                                    name="phone"
                                    value={settings.phone}
                                    onChange={handleChange}
                                    required
                                    disabled={saving}
                                    autoComplete="tel"
                                    className="w-full pl-10 pr-4 py-2.5 text-slate-800 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky/30 disabled:opacity-60 bg-white text-slate-900"
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Company Email
                            </label>

                            <div className="relative">
                                <MdEmail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />

                                <input
                                    type="email"
                                    name="email"
                                    value={settings.email}
                                    onChange={handleChange}
                                    required
                                    disabled={saving}
                                    autoComplete="email"
                                    className="w-full pl-10 pr-4 py-2.5 text-slate-800 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky/30 disabled:opacity-60 bg-white text-slate-900"
                                />
                            </div>
                        </div>

                        {/* WhatsApp */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                WhatsApp Number
                            </label>

                            <div className="relative">
                                <MdWhatsapp className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />

                                <input
                                    type="text"
                                    name="whatsapp"
                                    value={settings.whatsapp}
                                    onChange={handleChange}
                                    required
                                    disabled={saving}
                                    placeholder="918129842105"
                                    autoComplete="tel"
                                    className="w-full pl-10 pr-4 py-2.5 text-slate-800 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky/30 disabled:opacity-60 bg-white text-slate-900"
                                />
                            </div>
                        </div>

                    </div>

                    {/* Address */}
                    <div className="mt-5">
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Company Address
                        </label>

                        <div className="relative">
                            <MdLocationOn className="absolute left-3 top-3 text-slate-400" />

                            <textarea
                                name="address"
                                value={settings.address}
                                onChange={handleChange}
                                required
                                disabled={saving}
                                rows="3"
                                autoComplete="street-address"
                                className="w-full pl-10 pr-4 py-2.5 text-slate-800 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky/30 resize-none disabled:opacity-60 bg-white text-slate-900"
                            />
                        </div>
                    </div>

                    {/* Save */}
                    <div className="mt-6 flex justify-end">

                        <button
                            type="submit"
                            disabled={saving}
                            className="bg-sky text-white px-5 py-2.5 rounded-lg font-medium flex items-center gap-2 hover:bg-sky/90 transition-colors disabled:opacity-50"
                        >
                            <MdSave />

                            {saving
                                ? 'Saving...'
                                : 'Save Settings'}
                        </button>

                    </div>

                </form>
            </div>

            {/* Admin Account */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100">

                <div className="px-6 py-5 border-b border-slate-100 flex items-center gap-3">

                    <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center">
                        <MdLock className="text-xl" />
                    </div>

                    <div>
                        <h2 className="font-bold text-slate-800">
                            Admin Account
                        </h2>

                        <p className="text-sm text-slate-500">
                            Manage your administrator account.
                        </p>
                    </div>

                </div>

                <div className="p-6">

                    <div className="bg-slate-50 rounded-xl p-4 mb-5">

                        <p className="text-xs font-medium text-slate-500 mb-1">
                            Logged in as
                        </p>

                        <p className="font-medium text-slate-800">
                            {auth.currentUser?.email || 'Admin User'}
                        </p>

                    </div>

                    <button
                        type="button"
                        onClick={handlePasswordReset}
                        disabled={resetting}
                        className="px-5 py-2.5 border border-slate-200 text-slate-700 rounded-lg font-medium flex items-center gap-2 hover:bg-slate-50 transition-colors disabled:opacity-50"
                    >
                        <MdLock />

                        {resetting
                            ? 'Sending...'
                            : 'Send Password Reset Email'}
                    </button>

                    <p className="text-xs text-slate-400 mt-3">
                        A password reset link will be sent to your admin email.
                    </p>

                </div>
            </div>

        </div>
    );
}

