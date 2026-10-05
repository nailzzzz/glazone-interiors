import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { useNavigate } from 'react-router-dom';

import {
  MdDesignServices,
  MdCategory,
  MdCollections,
  MdEmail,
  MdTrendingUp,
  MdArrowForward,
  MdAccessTime,
  MdRefresh
} from 'react-icons/md';

export default function Dashboard() {
  const navigate = useNavigate();

  // ==========================================
  // STATS
  // ==========================================

  const [stats, setStats] = useState({
    services: 0,
    products: 0,
    projects: 0,
    gallery: 0,
    enquiries: 0
  });

  // ==========================================
  // ENQUIRIES
  // ==========================================

  const [recentEnquiries, setRecentEnquiries] = useState([]);

  // ==========================================
  // SYSTEM ACTIVITY
  // ==========================================

  const [activities, setActivities] = useState([]);

  // ==========================================
  // LOADING
  // ==========================================

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // ==========================================
  // SAFE DATE CONVERTER
  // ==========================================

  const getDateValue = (value) => {
    if (!value) return 0;

    // Firebase Timestamp
    if (typeof value?.toMillis === 'function') {
      return value.toMillis();
    }

    // JavaScript Date
    if (value instanceof Date) {
      return value.getTime();
    }

    // String / number
    const date = new Date(value).getTime();

    return Number.isNaN(date) ? 0 : date;
  };

  // ==========================================
  // FORMAT DATE
  // ==========================================

  const formatDate = (value) => {
    const timestamp = getDateValue(value);

    if (!timestamp) {
      return 'Recently';
    }

    return new Date(timestamp).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // ==========================================
  // FETCH DASHBOARD DATA
  // ==========================================

  const fetchDashboardData = async () => {
    try {
      setRefreshing(true);

      // ========================================
      // FETCH ALL COLLECTIONS
      // ========================================

      const [
        servicesSnap,
        productsSnap,
        projectsSnap,
        gallerySnap,
        enquiriesSnap
      ] = await Promise.all([
        getDocs(collection(db, 'services')),
        getDocs(collection(db, 'products')),
        getDocs(collection(db, 'projects')),
        getDocs(collection(db, 'gallery')),
        getDocs(collection(db, 'enquiries'))
      ]);

      // ========================================
      // SET STATS
      // ========================================

      setStats({
        services: servicesSnap.size,
        products: productsSnap.size,
        projects: projectsSnap.size,
        gallery: gallerySnap.size,
        enquiries: enquiriesSnap.size
      });

      // ========================================
      // ENQUIRIES DATA
      // ========================================

      const enquiries = enquiriesSnap.docs.map((item) => ({
        id: item.id,
        ...item.data()
      }));

      // Sort newest first
      enquiries.sort((a, b) => {
        const dateA =
          getDateValue(a.createdAt) ||
          getDateValue(a.updatedAt);

        const dateB =
          getDateValue(b.createdAt) ||
          getDateValue(b.updatedAt);

        return dateB - dateA;
      });

      setRecentEnquiries(enquiries.slice(0, 5));

      // ========================================
      // SYSTEM ACTIVITIES
      // ========================================

      const allActivities = [];

      // ----------------------------------------
      // SERVICES
      // ----------------------------------------

      servicesSnap.docs.forEach((item) => {
        const data = item.data();

        allActivities.push({
          id: `service-${item.id}`,
          type: 'service',
          title: data.title || 'Service',
          message: 'Service available',
          date:
            data.updatedAt ||
            data.createdAt ||
            null
        });
      });

      // ----------------------------------------
      // PRODUCTS
      // ----------------------------------------

      productsSnap.docs.forEach((item) => {
        const data = item.data();

        allActivities.push({
          id: `product-${item.id}`,
          type: 'product',
          title: data.title || 'Product',
          message: 'Product available',
          date:
            data.updatedAt ||
            data.createdAt ||
            null
        });
      });

      // ----------------------------------------
      // PROJECTS
      // ----------------------------------------

      projectsSnap.docs.forEach((item) => {
        const data = item.data();

        allActivities.push({
          id: `project-${item.id}`,
          type: 'project',
          title: data.title || 'Project',
          message: 'Project available',
          date:
            data.updatedAt ||
            data.createdAt ||
            null
        });
      });

      // ----------------------------------------
      // GALLERY
      // ----------------------------------------

      gallerySnap.docs.forEach((item) => {
        const data = item.data();

        allActivities.push({
          id: `gallery-${item.id}`,
          type: 'gallery',
          title: data.category || 'Gallery',
          message: 'Gallery image available',
          date:
            data.updatedAt ||
            data.createdAt ||
            null
        });
      });

      // ----------------------------------------
      // ENQUIRIES
      // ----------------------------------------

      enquiriesSnap.docs.forEach((item) => {
        const data = item.data();

        allActivities.push({
          id: `enquiry-${item.id}`,
          type: 'enquiry',
          title:
            data.name ||
            data.fullName ||
            data.customerName ||
            'New Enquiry',
          message: 'New enquiry received',
          date:
            data.createdAt ||
            data.updatedAt ||
            null
        });
      });

      // ========================================
      // SORT ACTIVITIES
      // ========================================

      allActivities.sort((a, b) => {
        return (
          getDateValue(b.date) -
          getDateValue(a.date)
        );
      });

      // If timestamps don't exist,
      // still show useful activity information
      if (allActivities.length === 0) {
        setActivities([]);
      } else {
        setActivities(allActivities.slice(0, 8));
      }

    } catch (error) {
      console.error(
        'Error fetching dashboard data:',
        error
      );

      // Keep dashboard usable even if one
      // collection has a permission/network problem
      setRecentEnquiries([]);
      setActivities([]);

    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // ==========================================
  // LOAD DASHBOARD
  // ==========================================

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // ==========================================
  // STAT CARDS
  // ==========================================

  const statCards = [
    {
      title: 'Total Services',
      value: stats.services,
      icon: <MdDesignServices />,
      color: 'bg-blue-500',
      route: '/admin/services'
    },
    {
      title: 'Total Products',
      value: stats.products,
      icon: <MdCategory />,
      color: 'bg-emerald-500',
      route: '/admin/products'
    },
    {
      title: 'Total Projects',
      value: stats.projects,
      icon: <MdCollections />,
      color: 'bg-purple-500',
      route: '/admin/projects'
    },
    {
      title: 'Gallery Images',
      value: stats.gallery,
      icon: <MdCollections />,
      color: 'bg-amber-500',
      route: '/admin/gallery'
    },
    {
      title: 'New Enquiries',
      value: stats.enquiries,
      icon: <MdEmail />,
      color: 'bg-rose-500',
      route: '/admin/enquiries'
    }
  ];

  // ==========================================
  // ACTIVITY ICON
  // ==========================================

  const getActivityIcon = (type) => {
    switch (type) {
      case 'service':
        return <MdDesignServices />;

      case 'product':
        return <MdCategory />;

      case 'project':
        return <MdCollections />;

      case 'gallery':
        return <MdCollections />;

      case 'enquiry':
        return <MdEmail />;

      default:
        return <MdTrendingUp />;
    }
  };

  // ==========================================
  // ACTIVITY COLOR
  // ==========================================

  const getActivityColor = (type) => {
    switch (type) {
      case 'service':
        return 'bg-blue-100 text-blue-600';

      case 'product':
        return 'bg-emerald-100 text-emerald-600';

      case 'project':
        return 'bg-purple-100 text-purple-600';

      case 'gallery':
        return 'bg-amber-100 text-amber-600';

      case 'enquiry':
        return 'bg-rose-100 text-rose-600';

      default:
        return 'bg-slate-100 text-slate-600';
    }
  };

  // ==========================================
  // ENQUIRY NAME
  // ==========================================

  const getEnquiryName = (enquiry) => {
    return (
      enquiry.name ||
      enquiry.fullName ||
      enquiry.customerName ||
      enquiry.username ||
      'New Enquiry'
    );
  };

  // ==========================================
  // ENQUIRY MESSAGE
  // ==========================================

  const getEnquiryMessage = (enquiry) => {
    return (
      enquiry.message ||
      enquiry.subject ||
      enquiry.service ||
      enquiry.project ||
      'Customer enquiry received'
    );
  };

  // ==========================================
  // LOADING SCREEN
  // ==========================================

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">

        <div className="text-center">

          <div className="w-12 h-12 border-4 border-sky border-t-transparent rounded-full animate-spin mx-auto"></div>

          <p className="text-slate-500 mt-4">
            Loading dashboard...
          </p>

        </div>

      </div>
    );
  }

  // ==========================================
  // RETURN
  // ==========================================

  return (
    <div>

      {/* ========================================
          HEADER
      ======================================== */}

      <div className="flex justify-between items-start mb-8">

        <div>

          <h1 className="text-2xl font-bold text-slate-800">
            Dashboard Overview
          </h1>

          <p className="text-slate-500">
            Welcome to the Glazone Admin Portal.
          </p>

        </div>

        {/* REFRESH BUTTON */}

        <button
          type="button"
          onClick={fetchDashboardData}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50"
        >

          <MdRefresh
            className={
              refreshing
                ? 'animate-spin'
                : ''
            }
          />

          Refresh

        </button>

      </div>


      {/* ========================================
          STAT CARDS
      ======================================== */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">

        {statCards.map((card, index) => (

          <button
            type="button"
            key={index}
            onClick={() => navigate(card.route)}
            className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center gap-4 text-left hover:shadow-md hover:-translate-y-0.5 transition-all"
          >

            <div
              className={`w-14 h-14 rounded-xl flex items-center justify-center text-white text-2xl ${card.color}`}
            >
              {card.icon}
            </div>

            <div>

              <p className="text-sm font-medium text-slate-500">
                {card.title}
              </p>

              <h3 className="text-2xl font-bold text-slate-800">
                {card.value}
              </h3>

            </div>

          </button>

        ))}

      </div>


      {/* ========================================
          LOWER SECTION
      ======================================== */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">


        {/* ======================================
            RECENT ENQUIRIES
        ====================================== */}

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 min-h-[384px] flex flex-col">

          {/* HEADER */}

          <div className="flex justify-between items-center mb-6">

            <h3 className="text-lg font-bold text-slate-800">
              Recent Enquiries
            </h3>

            <button
              type="button"
              onClick={() => navigate('/admin/enquiries')}
              className="text-sky text-sm font-medium hover:underline flex items-center gap-1"
            >
              View All
              <MdArrowForward />
            </button>

          </div>


          {/* ENQUIRIES */}

          {recentEnquiries.length === 0 ? (

            <div className="flex-1 flex items-center justify-center text-slate-400">

              <div className="text-center">

                <MdEmail className="text-5xl mx-auto mb-2 opacity-50" />

                <p className="font-medium">
                  No enquiries found
                </p>

                <p className="text-sm mt-1">
                  New customer enquiries will appear here.
                </p>

              </div>

            </div>

          ) : (

            <div className="space-y-3 overflow-y-auto">

              {recentEnquiries.map((enquiry) => (

                <button
                  type="button"
                  key={enquiry.id}
                  onClick={() => navigate('/admin/enquiries')}
                  className="w-full text-left flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100"
                >

                  {/* AVATAR */}

                  <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-500 flex items-center justify-center font-bold flex-shrink-0">

                    {getEnquiryName(enquiry)
                      .charAt(0)
                      .toUpperCase()}

                  </div>


                  {/* CONTENT */}

                  <div className="min-w-0 flex-1">

                    <p className="font-semibold text-slate-800 truncate">
                      {getEnquiryName(enquiry)}
                    </p>

                    <p className="text-sm text-slate-500 truncate">
                      {getEnquiryMessage(enquiry)}
                    </p>

                  </div>


                  {/* DATE */}

                  <div className="text-xs text-slate-400 flex items-center gap-1 flex-shrink-0">

                    <MdAccessTime />

                    {formatDate(
                      enquiry.createdAt ||
                      enquiry.updatedAt
                    )}

                  </div>

                </button>

              ))}

            </div>

          )}

        </div>


        {/* ======================================
            SYSTEM ACTIVITY
        ====================================== */}

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 min-h-[384px] flex flex-col">

          {/* HEADER */}

          <div className="flex justify-between items-center mb-6">

            <h3 className="text-lg font-bold text-slate-800">
              System Activity
            </h3>

            <MdTrendingUp className="text-slate-400 text-xl" />

          </div>


          {/* ACTIVITY */}

          {activities.length === 0 ? (

            <div className="flex-1 flex items-center justify-center text-slate-400">

              <div className="text-center">

                <MdTrendingUp className="text-5xl mx-auto mb-2 opacity-50" />

                <p className="font-medium">
                  No activity available
                </p>

                <p className="text-sm mt-1">
                  Activity will appear as your website is updated.
                </p>

              </div>

            </div>

          ) : (

            <div className="space-y-3 overflow-y-auto">

              {activities.map((activity) => (

                <div
                  key={activity.id}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors"
                >

                  {/* ICON */}

                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg flex-shrink-0 ${getActivityColor(
                      activity.type
                    )}`}
                  >
                    {getActivityIcon(activity.type)}
                  </div>


                  {/* TEXT */}

                  <div className="min-w-0 flex-1">

                    <p className="font-semibold text-slate-800 truncate">
                      {activity.title}
                    </p>

                    <p className="text-sm text-slate-500 truncate">
                      {activity.message}
                    </p>

                  </div>


                  {/* TIME */}

                  <div className="text-xs text-slate-400 flex items-center gap-1 flex-shrink-0">

                    <MdAccessTime />

                    {formatDate(activity.date)}

                  </div>

                </div>

              ))}

            </div>

          )}

        </div>

      </div>

    </div>
  );
}