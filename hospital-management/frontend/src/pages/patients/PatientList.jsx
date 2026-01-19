import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import patientService from '../../services/patientService';

const PatientList = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteModal, setDeleteModal] = useState({ show: false, patient: null });

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const response = await patientService.getAll();
      setPatients(response.data || response);
    } catch (error) {
      console.error('Error fetching patients:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await patientService.delete(deleteModal.patient._id);
      setPatients(patients.filter((p) => p._id !== deleteModal.patient._id));
      setDeleteModal({ show: false, patient: null });
    } catch (error) {
      console.error('Error deleting patient:', error);
    }
  };

  const filteredPatients = patients.filter(
    (patient) =>
      patient.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.phone?.includes(searchTerm)
  );

  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return 'N/A';
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      gap: '24px',
    },
    pageHeader: {
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
      background: 'linear-gradient(to right, #10b981, #059669)',
      color: 'white',
      fontWeight: '500',
      borderRadius: '12px',
      boxShadow: '0 10px 15px -3px rgba(16, 185, 129, 0.3)',
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
    tableCard: {
      backgroundColor: 'white',
      borderRadius: '16px',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      border: '1px solid #f3f4f6',
      overflow: 'hidden',
    },
    tableWrapper: {
      overflowX: 'auto',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
    },
    tableHead: {
      backgroundColor: '#f9fafb',
      borderBottom: '1px solid #f3f4f6',
    },
    tableHeadCell: {
      padding: '16px 24px',
      textAlign: 'left',
      fontSize: '12px',
      fontWeight: '600',
      color: '#6b7280',
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
    },
    tableHeadCellRight: {
      padding: '16px 24px',
      textAlign: 'right',
      fontSize: '12px',
      fontWeight: '600',
      color: '#6b7280',
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
    },
    tableRow: {
      borderBottom: '1px solid #f3f4f6',
      transition: 'background-color 0.2s',
    },
    tableCell: {
      padding: '16px 24px',
      whiteSpace: 'nowrap',
    },
    tableCellRight: {
      padding: '16px 24px',
      whiteSpace: 'nowrap',
      textAlign: 'right',
    },
    patientInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
    },
    patientAvatar: {
      width: '40px',
      height: '40px',
      background: 'linear-gradient(to bottom right, #10b981, #059669)',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontWeight: '600',
    },
    patientName: {
      fontWeight: '500',
      color: '#111827',
      margin: 0,
    },
    patientId: {
      fontSize: '14px',
      color: '#6b7280',
      margin: 0,
    },
    contactEmail: {
      fontSize: '14px',
      color: '#111827',
      margin: 0,
    },
    contactPhone: {
      fontSize: '14px',
      color: '#6b7280',
      margin: 0,
    },
    ageText: {
      fontSize: '14px',
      color: '#111827',
      margin: 0,
    },
    genderText: {
      fontSize: '14px',
      color: '#6b7280',
      margin: 0,
      textTransform: 'capitalize',
    },
    bloodBadge: {
      display: 'inline-flex',
      padding: '4px 10px',
      backgroundColor: '#fee2e2',
      color: '#b91c1c',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: '500',
    },
    naText: {
      color: '#9ca3af',
    },
    actionButtons: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      gap: '8px',
    },
    editButton: {
      padding: '8px',
      color: '#2563eb',
      backgroundColor: 'transparent',
      borderRadius: '8px',
      border: 'none',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      textDecoration: 'none',
    },
    deleteButton: {
      padding: '8px',
      color: '#dc2626',
      backgroundColor: 'transparent',
      borderRadius: '8px',
      border: 'none',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
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
      backgroundColor: '#059669',
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
      border: '4px solid #10b981',
      borderTopColor: 'transparent',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
    },
    loadingText: {
      color: '#6b7280',
      fontWeight: '500',
    },
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingContent}>
          <div style={styles.spinner}></div>
          <p style={styles.loadingText}>Loading patients...</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Page Header */}
      <div style={styles.pageHeader}>
        <div>
          <h1 style={styles.pageTitle}>Patients</h1>
          <p style={styles.pageSubtitle}>Manage patient records</p>
        </div>
        <Link to="/patients/new" style={styles.primaryButton}>
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Patient
        </Link>
      </div>

      {/* Search and Filters */}
      <div style={styles.searchCard}>
        <div style={styles.searchContainer}>
          <div style={styles.searchInputWrapper}>
            <div style={styles.searchIcon}>
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search patients by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={styles.searchInput}
            />
          </div>
          <div style={styles.searchCount}>
            <span style={{ fontWeight: '500' }}>{filteredPatients.length}</span>
            <span>patients found</span>
          </div>
        </div>
      </div>

      {/* Patients Table */}
      {filteredPatients.length > 0 ? (
        <div style={styles.tableCard}>
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead style={styles.tableHead}>
                <tr>
                  <th style={styles.tableHeadCell}>Patient</th>
                  <th style={styles.tableHeadCell}>Contact</th>
                  <th style={styles.tableHeadCell}>Age / Gender</th>
                  <th style={styles.tableHeadCell}>Blood Group</th>
                  <th style={styles.tableHeadCellRight}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPatients.map((patient) => (
                  <tr key={patient._id} style={styles.tableRow}>
                    <td style={styles.tableCell}>
                      <div style={styles.patientInfo}>
                        <div style={styles.patientAvatar}>
                          {patient.name?.charAt(0)?.toUpperCase() || 'P'}
                        </div>
                        <div>
                          <p style={styles.patientName}>{patient.name}</p>
                          <p style={styles.patientId}>ID: {patient._id?.slice(-6)}</p>
                        </div>
                      </div>
                    </td>
                    <td style={styles.tableCell}>
                      <p style={styles.contactEmail}>{patient.email || 'No email'}</p>
                      <p style={styles.contactPhone}>{patient.phone || 'No phone'}</p>
                    </td>
                    <td style={styles.tableCell}>
                      <p style={styles.ageText}>{calculateAge(patient.dateOfBirth)} years</p>
                      <p style={styles.genderText}>{patient.gender || 'N/A'}</p>
                    </td>
                    <td style={styles.tableCell}>
                      {patient.bloodGroup ? (
                        <span style={styles.bloodBadge}>{patient.bloodGroup}</span>
                      ) : (
                        <span style={styles.naText}>N/A</span>
                      )}
                    </td>
                    <td style={styles.tableCellRight}>
                      <div style={styles.actionButtons}>
                        <Link to={`/patients/${patient._id}/edit`} style={styles.editButton}>
                          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </Link>
                        <button onClick={() => setDeleteModal({ show: true, patient })} style={styles.deleteButton}>
                          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>
            <svg width="32" height="32" fill="none" stroke="#9ca3af" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h3 style={styles.emptyTitle}>No patients found</h3>
          <p style={styles.emptyText}>
            {searchTerm ? 'Try adjusting your search terms' : 'Get started by adding your first patient'}
          </p>
          <Link to="/patients/new" style={styles.emptyButton}>
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Patient
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
                <h3 style={styles.modalTitle}>Delete Patient</h3>
                <p style={styles.modalSubtitle}>This action cannot be undone</p>
              </div>
            </div>
            <p style={styles.modalText}>
              Are you sure you want to delete <strong>{deleteModal.patient?.name}</strong>? 
              All associated records will be permanently removed.
            </p>
            <div style={styles.modalActions}>
              <button onClick={() => setDeleteModal({ show: false, patient: null })} style={styles.modalCancelButton}>
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

export default PatientList;
