import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import appointmentService from '../../services/appointmentService';

const AppointmentList = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [deleteModal, setDeleteModal] = useState({ show: false, appointment: null });

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await appointmentService.getAll();
      setAppointments(response.data || response);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await appointmentService.delete(deleteModal.appointment._id);
      setAppointments(appointments.filter((a) => a._id !== deleteModal.appointment._id));
      setDeleteModal({ show: false, appointment: null });
    } catch (error) {
      console.error('Error deleting appointment:', error);
    }
  };

  const handleStatusChange = async (appointmentId, newStatus) => {
    try {
      await appointmentService.updateStatus(appointmentId, newStatus);
      setAppointments(
        appointments.map((a) =>
          a._id === appointmentId ? { ...a, status: newStatus } : a
        )
      );
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const filteredAppointments = appointments.filter((appointment) => {
    const matchesSearch =
      appointment.patient?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.doctor?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || appointment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (time) => {
    if (!time) return 'N/A';
    return time;
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
      background: 'linear-gradient(to right, #8b5cf6, #7c3aed)',
      color: 'white',
      fontWeight: '500',
      borderRadius: '12px',
      boxShadow: '0 10px 15px -3px rgba(139, 92, 246, 0.3)',
      textDecoration: 'none',
      border: 'none',
      cursor: 'pointer',
      fontSize: '14px',
    },
    filterCard: {
      backgroundColor: 'white',
      borderRadius: '16px',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      border: '1px solid #f3f4f6',
      padding: '16px',
    },
    filterContainer: {
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
    },
    filterContainerDesktop: {
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
    filterButtons: {
      display: 'flex',
      gap: '8px',
      flexWrap: 'wrap',
    },
    filterButton: {
      padding: '8px 16px',
      borderRadius: '12px',
      fontSize: '14px',
      fontWeight: '500',
      textTransform: 'capitalize',
      border: 'none',
      cursor: 'pointer',
      transition: 'all 0.2s',
    },
    filterButtonActive: {
      backgroundColor: '#7c3aed',
      color: 'white',
    },
    filterButtonInactive: {
      backgroundColor: '#f3f4f6',
      color: '#4b5563',
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
      gap: '16px',
    },
    statCard: {
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '16px',
      border: '1px solid #f3f4f6',
    },
    statCardYellow: {
      backgroundColor: '#fefce8',
      border: '1px solid #fef08a',
    },
    statCardGreen: {
      backgroundColor: '#f0fdf4',
      border: '1px solid #bbf7d0',
    },
    statCardRed: {
      backgroundColor: '#fef2f2',
      border: '1px solid #fecaca',
    },
    statValue: {
      fontSize: '24px',
      fontWeight: '700',
      margin: 0,
    },
    statLabel: {
      fontSize: '14px',
      margin: 0,
    },
    appointmentsList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
    },
    appointmentCard: {
      backgroundColor: 'white',
      borderRadius: '16px',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      border: '1px solid #f3f4f6',
      padding: '24px',
      transition: 'all 0.3s',
    },
    appointmentContent: {
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
    },
    appointmentContentDesktop: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      gap: '16px',
    },
    dateSection: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      minWidth: '192px',
    },
    dateBox: {
      width: '56px',
      height: '56px',
      background: 'linear-gradient(to bottom right, #8b5cf6, #7c3aed)',
      borderRadius: '12px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      boxShadow: '0 4px 6px rgba(139, 92, 246, 0.3)',
    },
    dateMonth: {
      fontSize: '12px',
      fontWeight: '500',
    },
    dateDay: {
      fontSize: '18px',
      fontWeight: '700',
    },
    dateText: {
      fontWeight: '500',
      color: '#111827',
      margin: 0,
    },
    timeText: {
      fontSize: '14px',
      color: '#6b7280',
      margin: 0,
    },
    participantsSection: {
      flex: 1,
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '16px',
    },
    participantItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
    },
    patientAvatar: {
      width: '40px',
      height: '40px',
      backgroundColor: '#d1fae5',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#059669',
      fontWeight: '600',
    },
    doctorAvatar: {
      width: '40px',
      height: '40px',
      backgroundColor: '#dbeafe',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#2563eb',
      fontWeight: '600',
    },
    participantLabel: {
      fontSize: '12px',
      color: '#6b7280',
      margin: 0,
    },
    participantName: {
      fontWeight: '500',
      color: '#111827',
      margin: 0,
    },
    actionsSection: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
    },
    statusSelect: {
      padding: '8px 12px',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: '500',
      border: '1px solid',
      outline: 'none',
      cursor: 'pointer',
    },
    statusPending: {
      backgroundColor: '#fef3c7',
      color: '#b45309',
      borderColor: '#fde68a',
    },
    statusCompleted: {
      backgroundColor: '#d1fae5',
      color: '#047857',
      borderColor: '#a7f3d0',
    },
    statusCancelled: {
      backgroundColor: '#fee2e2',
      color: '#b91c1c',
      borderColor: '#fecaca',
    },
    statusConfirmed: {
      backgroundColor: '#dbeafe',
      color: '#1d4ed8',
      borderColor: '#bfdbfe',
    },
    actionButton: {
      padding: '8px',
      borderRadius: '8px',
      border: 'none',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'transparent',
      textDecoration: 'none',
    },
    editButton: {
      color: '#2563eb',
    },
    deleteButton: {
      color: '#dc2626',
    },
    notesSection: {
      marginTop: '16px',
      paddingTop: '16px',
      borderTop: '1px solid #f3f4f6',
    },
    notesText: {
      fontSize: '14px',
      color: '#6b7280',
      margin: 0,
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
      backgroundColor: '#7c3aed',
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
      border: '4px solid #8b5cf6',
      borderTopColor: 'transparent',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
    },
    loadingText: {
      color: '#6b7280',
      fontWeight: '500',
    },
  };

  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return styles.statusCompleted;
      case 'pending':
        return styles.statusPending;
      case 'cancelled':
        return styles.statusCancelled;
      case 'confirmed':
        return styles.statusConfirmed;
      default:
        return styles.statusPending;
    }
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingContent}>
          <div style={styles.spinner}></div>
          <p style={styles.loadingText}>Loading appointments...</p>
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
          <h1 style={styles.pageTitle}>Appointments</h1>
          <p style={styles.pageSubtitle}>Manage patient appointments</p>
        </div>
        <Link to="/appointments/new" style={styles.primaryButton}>
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Appointment
        </Link>
      </div>

      {/* Filters */}
      <div style={styles.filterCard}>
        <div style={styles.filterContainerDesktop}>
          <div style={styles.searchInputWrapper}>
            <div style={styles.searchIcon}>
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search by patient or doctor name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={styles.searchInput}
            />
          </div>
          <div style={styles.filterButtons}>
            {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                style={{
                  ...styles.filterButton,
                  ...(statusFilter === status ? styles.filterButtonActive : styles.filterButtonInactive),
                }}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <p style={{ ...styles.statValue, color: '#111827' }}>{appointments.length}</p>
          <p style={{ ...styles.statLabel, color: '#6b7280' }}>Total</p>
        </div>
        <div style={{ ...styles.statCard, ...styles.statCardYellow }}>
          <p style={{ ...styles.statValue, color: '#b45309' }}>
            {appointments.filter((a) => a.status === 'pending').length}
          </p>
          <p style={{ ...styles.statLabel, color: '#ca8a04' }}>Pending</p>
        </div>
        <div style={{ ...styles.statCard, ...styles.statCardGreen }}>
          <p style={{ ...styles.statValue, color: '#047857' }}>
            {appointments.filter((a) => a.status === 'completed').length}
          </p>
          <p style={{ ...styles.statLabel, color: '#059669' }}>Completed</p>
        </div>
        <div style={{ ...styles.statCard, ...styles.statCardRed }}>
          <p style={{ ...styles.statValue, color: '#b91c1c' }}>
            {appointments.filter((a) => a.status === 'cancelled').length}
          </p>
          <p style={{ ...styles.statLabel, color: '#dc2626' }}>Cancelled</p>
        </div>
      </div>

      {/* Appointments List */}
      {filteredAppointments.length > 0 ? (
        <div style={styles.appointmentsList}>
          {filteredAppointments.map((appointment) => (
            <div key={appointment._id} style={styles.appointmentCard}>
              <div style={styles.appointmentContentDesktop}>
                {/* Date & Time */}
                <div style={styles.dateSection}>
                  <div style={styles.dateBox}>
                    <span style={styles.dateMonth}>
                      {new Date(appointment.date).toLocaleDateString('en-US', { month: 'short' })}
                    </span>
                    <span style={styles.dateDay}>
                      {new Date(appointment.date).getDate()}
                    </span>
                  </div>
                  <div>
                    <p style={styles.dateText}>{formatDate(appointment.date)}</p>
                    <p style={styles.timeText}>{formatTime(appointment.time)}</p>
                  </div>
                </div>

                {/* Patient & Doctor */}
                <div style={styles.participantsSection}>
                  <div style={styles.participantItem}>
                    <div style={styles.patientAvatar}>
                      {appointment.patient?.name?.charAt(0) || 'P'}
                    </div>
                    <div>
                      <p style={styles.participantLabel}>Patient</p>
                      <p style={styles.participantName}>{appointment.patient?.name || 'Unknown'}</p>
                    </div>
                  </div>
                  <div style={styles.participantItem}>
                    <div style={styles.doctorAvatar}>
                      {appointment.doctor?.name?.charAt(0) || 'D'}
                    </div>
                    <div>
                      <p style={styles.participantLabel}>Doctor</p>
                      <p style={styles.participantName}>Dr. {appointment.doctor?.name || 'Unknown'}</p>
                    </div>
                  </div>
                </div>

                {/* Status & Actions */}
                <div style={styles.actionsSection}>
                  <select
                    value={appointment.status}
                    onChange={(e) => handleStatusChange(appointment._id, e.target.value)}
                    style={{ ...styles.statusSelect, ...getStatusStyle(appointment.status) }}
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>

                  <Link
                    to={`/appointments/${appointment._id}/edit`}
                    style={{ ...styles.actionButton, ...styles.editButton }}
                  >
                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </Link>
                  <button
                    onClick={() => setDeleteModal({ show: true, appointment })}
                    style={{ ...styles.actionButton, ...styles.deleteButton }}
                  >
                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Notes */}
              {appointment.notes && (
                <div style={styles.notesSection}>
                  <p style={styles.notesText}>
                    <strong>Notes:</strong> {appointment.notes}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>
            <svg width="32" height="32" fill="none" stroke="#9ca3af" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 style={styles.emptyTitle}>No appointments found</h3>
          <p style={styles.emptyText}>
            {searchTerm || statusFilter !== 'all'
              ? 'Try adjusting your filters'
              : 'Get started by creating your first appointment'}
          </p>
          <Link to="/appointments/new" style={styles.emptyButton}>
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Appointment
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
                <h3 style={styles.modalTitle}>Delete Appointment</h3>
                <p style={styles.modalSubtitle}>This action cannot be undone</p>
              </div>
            </div>
            <p style={styles.modalText}>
              Are you sure you want to delete this appointment for{' '}
              <strong>{deleteModal.appointment?.patient?.name}</strong>?
            </p>
            <div style={styles.modalActions}>
              <button onClick={() => setDeleteModal({ show: false, appointment: null })} style={styles.modalCancelButton}>
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

export default AppointmentList;
