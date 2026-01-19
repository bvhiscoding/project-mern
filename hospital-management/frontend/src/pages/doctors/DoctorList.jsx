import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import doctorService from '../../services/doctorService';

const DoctorList = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteModal, setDeleteModal] = useState({ show: false, doctor: null });

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const response = await doctorService.getAll();
      setDoctors(response.data || response);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await doctorService.delete(deleteModal.doctor._id);
      setDoctors(doctors.filter((d) => d._id !== deleteModal.doctor._id));
      setDeleteModal({ show: false, doctor: null });
    } catch (error) {
      console.error('Error deleting doctor:', error);
    }
  };

  const filteredDoctors = doctors.filter(
    (doctor) =>
      doctor.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialization?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      gap: '24px',
    },
    pageHeader: {
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
    },
    pageHeaderDesktop: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '16px',
    },
    pageTitle: {
      fontSize: '24px',
      fontWeight: '700',
      color: '#111827',
      margin: 0,
    },
    pageSubtitle: {
      color: '#6b7280',
      marginTop: '4px',
      fontSize: '14px',
    },
    primaryButton: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      padding: '10px 16px',
      background: 'linear-gradient(to right, #3b82f6, #2563eb)',
      color: 'white',
      fontWeight: '500',
      borderRadius: '12px',
      boxShadow: '0 10px 15px -3px rgba(59, 130, 246, 0.3)',
      textDecoration: 'none',
      border: 'none',
      cursor: 'pointer',
      fontSize: '14px',
    },
    searchCard: {
      backgroundColor: 'white',
      borderRadius: '16px',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      border: '1px solid #f3f4f6',
      padding: '16px',
    },
    searchContainer: {
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
    },
    searchContainerDesktop: {
      display: 'flex',
      flexDirection: 'row',
      gap: '16px',
      alignItems: 'center',
    },
    searchInputWrapper: {
      position: 'relative',
      flex: 1,
    },
    searchIcon: {
      position: 'absolute',
      top: '50%',
      left: '16px',
      transform: 'translateY(-50%)',
      color: '#9ca3af',
      pointerEvents: 'none',
    },
    searchInput: {
      width: '100%',
      paddingLeft: '48px',
      paddingRight: '16px',
      paddingTop: '12px',
      paddingBottom: '12px',
      border: '1px solid #e5e7eb',
      borderRadius: '12px',
      fontSize: '14px',
      color: '#111827',
      outline: 'none',
      boxSizing: 'border-box',
    },
    searchCount: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      fontSize: '14px',
      color: '#6b7280',
    },
    searchCountBold: {
      fontWeight: '500',
    },
    doctorsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
      gap: '16px',
    },
    doctorCard: {
      backgroundColor: 'white',
      borderRadius: '16px',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      border: '1px solid #f3f4f6',
      padding: '24px',
      transition: 'all 0.3s',
    },
    doctorHeader: {
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      marginBottom: '16px',
    },
    doctorHeaderLeft: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
    },
    doctorAvatar: {
      width: '56px',
      height: '56px',
      background: 'linear-gradient(to bottom right, #3b82f6, #2563eb)',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontSize: '20px',
      fontWeight: '600',
      boxShadow: '0 4px 6px rgba(59, 130, 246, 0.3)',
    },
    doctorName: {
      fontWeight: '600',
      color: '#111827',
      margin: 0,
      fontSize: '16px',
    },
    specializationBadge: {
      display: 'inline-flex',
      padding: '4px 10px',
      borderRadius: '8px',
      fontSize: '12px',
      fontWeight: '500',
      marginTop: '4px',
    },
    doctorDetails: {
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      marginBottom: '16px',
    },
    detailItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      fontSize: '14px',
      color: '#4b5563',
    },
    detailIcon: {
      color: '#9ca3af',
    },
    cardActions: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      paddingTop: '16px',
      borderTop: '1px solid #f3f4f6',
    },
    editButton: {
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      padding: '8px 16px',
      fontSize: '14px',
      fontWeight: '500',
      color: '#2563eb',
      backgroundColor: '#eff6ff',
      borderRadius: '12px',
      textDecoration: 'none',
      border: 'none',
      cursor: 'pointer',
    },
    deleteButton: {
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      padding: '8px 16px',
      fontSize: '14px',
      fontWeight: '500',
      color: '#dc2626',
      backgroundColor: '#fef2f2',
      borderRadius: '12px',
      border: 'none',
      cursor: 'pointer',
    },
    emptyState: {
      backgroundColor: 'white',
      borderRadius: '16px',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      border: '1px solid #f3f4f6',
      padding: '48px',
      textAlign: 'center',
    },
    emptyIcon: {
      width: '64px',
      height: '64px',
      backgroundColor: '#f3f4f6',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto 16px',
    },
    emptyTitle: {
      color: '#111827',
      fontWeight: '600',
      marginBottom: '8px',
    },
    emptyText: {
      color: '#6b7280',
      marginBottom: '24px',
    },
    emptyButton: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      padding: '8px 16px',
      backgroundColor: '#2563eb',
      color: 'white',
      fontWeight: '500',
      borderRadius: '12px',
      textDecoration: 'none',
    },
    modalOverlay: {
      position: 'fixed',
      inset: 0,
      zIndex: 50,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
      backgroundColor: 'white',
      borderRadius: '16px',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      maxWidth: '448px',
      width: '100%',
      padding: '24px',
    },
    modalHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      marginBottom: '16px',
    },
    modalIcon: {
      width: '48px',
      height: '48px',
      backgroundColor: '#fee2e2',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    modalTitle: {
      fontSize: '18px',
      fontWeight: '600',
      color: '#111827',
      margin: 0,
    },
    modalSubtitle: {
      fontSize: '14px',
      color: '#6b7280',
      margin: 0,
    },
    modalText: {
      color: '#4b5563',
      marginBottom: '24px',
    },
    modalActions: {
      display: 'flex',
      gap: '12px',
    },
    modalCancelButton: {
      flex: 1,
      padding: '10px 16px',
      color: '#374151',
      backgroundColor: '#f3f4f6',
      fontWeight: '500',
      borderRadius: '12px',
      border: 'none',
      cursor: 'pointer',
    },
    modalDeleteButton: {
      flex: 1,
      padding: '10px 16px',
      color: 'white',
      backgroundColor: '#dc2626',
      fontWeight: '500',
      borderRadius: '12px',
      border: 'none',
      cursor: 'pointer',
    },
    loadingContainer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '384px',
    },
    loadingContent: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '16px',
    },
    spinner: {
      width: '48px',
      height: '48px',
      border: '4px solid #3b82f6',
      borderTopColor: 'transparent',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
    },
    loadingText: {
      color: '#6b7280',
      fontWeight: '500',
    },
  };

  const getSpecializationStyle = (spec) => {
    const colors = {
      cardiology: { backgroundColor: '#fee2e2', color: '#b91c1c' },
      neurology: { backgroundColor: '#ede9fe', color: '#6d28d9' },
      orthopedics: { backgroundColor: '#dbeafe', color: '#1d4ed8' },
      pediatrics: { backgroundColor: '#d1fae5', color: '#047857' },
      dermatology: { backgroundColor: '#fef3c7', color: '#b45309' },
      default: { backgroundColor: '#f3f4f6', color: '#374151' },
    };
    return colors[spec?.toLowerCase()] || colors.default;
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingContent}>
          <div style={styles.spinner}></div>
          <p style={styles.loadingText}>Loading doctors...</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Page Header */}
      <div style={styles.pageHeaderDesktop}>
        <div>
          <h1 style={styles.pageTitle}>Doctors</h1>
          <p style={styles.pageSubtitle}>Manage your medical staff</p>
        </div>
        <Link to="/doctors/new" style={styles.primaryButton}>
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Doctor
        </Link>
      </div>

      {/* Search and Filters */}
      <div style={styles.searchCard}>
        <div style={styles.searchContainerDesktop}>
          <div style={styles.searchInputWrapper}>
            <div style={styles.searchIcon}>
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search doctors by name, specialization, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={styles.searchInput}
            />
          </div>
          <div style={styles.searchCount}>
            <span style={styles.searchCountBold}>{filteredDoctors.length}</span>
            <span>doctors found</span>
          </div>
        </div>
      </div>

      {/* Doctors Grid */}
      {filteredDoctors.length > 0 ? (
        <div style={styles.doctorsGrid}>
          {filteredDoctors.map((doctor) => (
            <div key={doctor._id} style={styles.doctorCard}>
              <div style={styles.doctorHeader}>
                <div style={styles.doctorHeaderLeft}>
                  <div style={styles.doctorAvatar}>
                    {doctor.name?.charAt(0)?.toUpperCase() || 'D'}
                  </div>
                  <div>
                    <h3 style={styles.doctorName}>Dr. {doctor.name}</h3>
                    <span style={{ ...styles.specializationBadge, ...getSpecializationStyle(doctor.specialization) }}>
                      {doctor.specialization || 'General'}
                    </span>
                  </div>
                </div>
              </div>

              <div style={styles.doctorDetails}>
                <div style={styles.detailItem}>
                  <svg style={styles.detailIcon} width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {doctor.email || 'No email'}
                  </span>
                </div>
                <div style={styles.detailItem}>
                  <svg style={styles.detailIcon} width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span>{doctor.phone || 'No phone'}</span>
                </div>
                {doctor.experience && (
                  <div style={styles.detailItem}>
                    <svg style={styles.detailIcon} width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{doctor.experience} years experience</span>
                  </div>
                )}
              </div>

              <div style={styles.cardActions}>
                <Link to={`/doctors/${doctor._id}/edit`} style={styles.editButton}>
                  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit
                </Link>
                <button onClick={() => setDeleteModal({ show: true, doctor })} style={styles.deleteButton}>
                  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>
            <svg width="32" height="32" fill="none" stroke="#9ca3af" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 style={styles.emptyTitle}>No doctors found</h3>
          <p style={styles.emptyText}>
            {searchTerm ? 'Try adjusting your search terms' : 'Get started by adding your first doctor'}
          </p>
          <Link to="/doctors/new" style={styles.emptyButton}>
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Doctor
          </Link>
        </div>
      )}

      {/* Delete Modal */}
      {deleteModal.show && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <div style={styles.modalIcon}>
                <svg width="24" height="24" fill="none" stroke="#dc2626" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <h3 style={styles.modalTitle}>Delete Doctor</h3>
                <p style={styles.modalSubtitle}>This action cannot be undone</p>
              </div>
            </div>
            <p style={styles.modalText}>
              Are you sure you want to delete <strong>Dr. {deleteModal.doctor?.name}</strong>? 
              All associated data will be permanently removed.
            </p>
            <div style={styles.modalActions}>
              <button onClick={() => setDeleteModal({ show: false, doctor: null })} style={styles.modalCancelButton}>
                Cancel
              </button>
              <button onClick={handleDelete} style={styles.modalDeleteButton}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorList;
