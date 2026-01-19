import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import appointmentService from '../../services/appointmentService';
import doctorService from '../../services/doctorService';
import patientService from '../../services/patientService';

const AppointmentForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    patient: '',
    doctor: '',
    date: '',
    time: '',
    status: 'pending',
    notes: '',
  });
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState('');

  const timeSlots = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '12:00 PM', '12:30 PM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM',
    '04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM',
  ];

  const statuses = ['pending', 'confirmed', 'completed', 'cancelled'];

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const [doctorsRes, patientsRes] = await Promise.all([
        doctorService.getAll(),
        patientService.getAll(),
      ]);
      setDoctors(doctorsRes.data || doctorsRes);
      setPatients(patientsRes.data || patientsRes);

      if (isEdit) {
        const appointmentRes = await appointmentService.getById(id);
        const appointment = appointmentRes.data || appointmentRes;
        setFormData({
          patient: appointment.patient?._id || appointment.patient || '',
          doctor: appointment.doctor?._id || appointment.doctor || '',
          date: appointment.date ? new Date(appointment.date).toISOString().split('T')[0] : '',
          time: appointment.time || '',
          status: appointment.status || 'pending',
          notes: appointment.notes || '',
        });
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load data');
    } finally {
      setFetchLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isEdit) {
        await appointmentService.update(id, formData);
      } else {
        await appointmentService.create(formData);
      }
      navigate('/appointments');
    } catch (error) {
      console.error('Error saving appointment:', error);
      setError(error.response?.data?.message || 'Failed to save appointment');
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    container: {
      maxWidth: '768px',
      margin: '0 auto',
    },
    header: {
      marginBottom: '24px',
    },
    backLink: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      color: '#6b7280',
      textDecoration: 'none',
      marginBottom: '16px',
      fontSize: '14px',
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
    formCard: {
      backgroundColor: 'white',
      borderRadius: '16px',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      border: '1px solid #f3f4f6',
      padding: '32px',
    },
    errorBox: {
      marginBottom: '24px',
      padding: '16px',
      backgroundColor: '#fef2f2',
      border: '1px solid #fecaca',
      borderRadius: '12px',
    },
    errorContent: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
    },
    errorText: {
      fontSize: '14px',
      color: '#dc2626',
      margin: 0,
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '24px',
    },
    formGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '24px',
    },
    formGroupFull: {
      gridColumn: '1 / -1',
    },
    label: {
      display: 'block',
      fontSize: '14px',
      fontWeight: '500',
      color: '#374151',
      marginBottom: '8px',
    },
    required: {
      color: '#ef4444',
    },
    input: {
      display: 'block',
      width: '100%',
      padding: '12px 16px',
      border: '1px solid #e5e7eb',
      borderRadius: '12px',
      fontSize: '14px',
      color: '#111827',
      outline: 'none',
      boxSizing: 'border-box',
      transition: 'all 0.2s',
    },
    select: {
      display: 'block',
      width: '100%',
      padding: '12px 16px',
      border: '1px solid #e5e7eb',
      borderRadius: '12px',
      fontSize: '14px',
      color: '#111827',
      outline: 'none',
      boxSizing: 'border-box',
      backgroundColor: 'white',
      cursor: 'pointer',
    },
    textarea: {
      display: 'block',
      width: '100%',
      padding: '12px 16px',
      border: '1px solid #e5e7eb',
      borderRadius: '12px',
      fontSize: '14px',
      color: '#111827',
      outline: 'none',
      boxSizing: 'border-box',
      resize: 'none',
      fontFamily: 'inherit',
    },
    warningText: {
      marginTop: '8px',
      fontSize: '14px',
      color: '#d97706',
    },
    warningLink: {
      color: '#7c3aed',
      textDecoration: 'none',
    },
    statusGroup: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '12px',
    },
    statusOption: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '8px 16px',
      borderRadius: '12px',
      border: '1px solid',
      cursor: 'pointer',
      transition: 'all 0.2s',
    },
    statusOptionActive: {
      borderColor: '#8b5cf6',
      backgroundColor: '#f5f3ff',
      color: '#6d28d9',
    },
    statusOptionInactive: {
      borderColor: '#e5e7eb',
      backgroundColor: 'white',
      color: '#374151',
    },
    hiddenRadio: {
      position: 'absolute',
      opacity: 0,
      width: 0,
      height: 0,
    },
    summaryCard: {
      backgroundColor: '#f5f3ff',
      borderRadius: '12px',
      padding: '16px',
      border: '1px solid #ede9fe',
    },
    summaryTitle: {
      fontSize: '14px',
      fontWeight: '500',
      color: '#6d28d9',
      marginBottom: '12px',
    },
    summaryGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
      gap: '16px',
    },
    summaryLabel: {
      color: '#7c3aed',
      fontSize: '14px',
      margin: 0,
    },
    summaryValue: {
      fontWeight: '500',
      color: '#4c1d95',
      margin: 0,
    },
    actions: {
      display: 'flex',
      flexDirection: 'row',
      gap: '12px',
      paddingTop: '24px',
      borderTop: '1px solid #f3f4f6',
    },
    submitButton: {
      padding: '12px 24px',
      background: 'linear-gradient(to right, #8b5cf6, #7c3aed)',
      color: 'white',
      fontWeight: '500',
      borderRadius: '12px',
      boxShadow: '0 10px 15px -3px rgba(139, 92, 246, 0.3)',
      border: 'none',
      cursor: 'pointer',
      fontSize: '14px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
    },
    submitButtonDisabled: {
      opacity: 0.5,
      cursor: 'not-allowed',
    },
    cancelButton: {
      padding: '12px 24px',
      color: '#374151',
      backgroundColor: '#f3f4f6',
      fontWeight: '500',
      borderRadius: '12px',
      border: 'none',
      cursor: 'pointer',
      fontSize: '14px',
      textDecoration: 'none',
      textAlign: 'center',
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
    spinnerSmall: {
      width: '20px',
      height: '20px',
      border: '2px solid white',
      borderTopColor: 'transparent',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
    },
    loadingText: {
      color: '#6b7280',
      fontWeight: '500',
    },
  };

  if (fetchLoading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingContent}>
          <div style={styles.spinner}></div>
          <p style={styles.loadingText}>Loading...</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Page Header */}
      <div style={styles.header}>
        <Link to="/appointments" style={styles.backLink}>
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Appointments
        </Link>
        <h1 style={styles.pageTitle}>
          {isEdit ? 'Edit Appointment' : 'Schedule New Appointment'}
        </h1>
        <p style={styles.pageSubtitle}>
          {isEdit ? 'Update appointment details' : 'Fill in the details to schedule a new appointment'}
        </p>
      </div>

      {/* Form */}
      <div style={styles.formCard}>
        {error && (
          <div style={styles.errorBox}>
            <div style={styles.errorContent}>
              <svg width="20" height="20" fill="none" stroke="#ef4444" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p style={styles.errorText}>{error}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGrid}>
            {/* Patient */}
            <div>
              <label style={styles.label}>
                Patient <span style={styles.required}>*</span>
              </label>
              <select
                name="patient"
                value={formData.patient}
                onChange={handleChange}
                required
                style={styles.select}
              >
                <option value="">Select a patient</option>
                {patients.map((patient) => (
                  <option key={patient._id} value={patient._id}>
                    {patient.name} {patient.phone ? `- ${patient.phone}` : ''}
                  </option>
                ))}
              </select>
              {patients.length === 0 && (
                <p style={styles.warningText}>
                  No patients found.{' '}
                  <Link to="/patients/new" style={styles.warningLink}>
                    Add a patient first
                  </Link>
                </p>
              )}
            </div>

            {/* Doctor */}
            <div>
              <label style={styles.label}>
                Doctor <span style={styles.required}>*</span>
              </label>
              <select
                name="doctor"
                value={formData.doctor}
                onChange={handleChange}
                required
                style={styles.select}
              >
                <option value="">Select a doctor</option>
                {doctors.map((doctor) => (
                  <option key={doctor._id} value={doctor._id}>
                    Dr. {doctor.name} {doctor.specialization ? `- ${doctor.specialization}` : ''}
                  </option>
                ))}
              </select>
              {doctors.length === 0 && (
                <p style={styles.warningText}>
                  No doctors found.{' '}
                  <Link to="/doctors/new" style={styles.warningLink}>
                    Add a doctor first
                  </Link>
                </p>
              )}
            </div>

            {/* Date */}
            <div>
              <label style={styles.label}>
                Date <span style={styles.required}>*</span>
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                min={new Date().toISOString().split('T')[0]}
                style={styles.input}
              />
            </div>

            {/* Time */}
            <div>
              <label style={styles.label}>
                Time <span style={styles.required}>*</span>
              </label>
              <select
                name="time"
                value={formData.time}
                onChange={handleChange}
                required
                style={styles.select}
              >
                <option value="">Select time slot</option>
                {timeSlots.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </div>

            {/* Status (only for edit) */}
            {isEdit && (
              <div style={styles.formGroupFull}>
                <label style={styles.label}>Status</label>
                <div style={styles.statusGroup}>
                  {statuses.map((status) => (
                    <label
                      key={status}
                      style={{
                        ...styles.statusOption,
                        ...(formData.status === status ? styles.statusOptionActive : styles.statusOptionInactive),
                      }}
                    >
                      <input
                        type="radio"
                        name="status"
                        value={status}
                        checked={formData.status === status}
                        onChange={handleChange}
                        style={styles.hiddenRadio}
                      />
                      <span style={{ textTransform: 'capitalize' }}>{status}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Notes */}
            <div style={styles.formGroupFull}>
              <label style={styles.label}>Notes</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={4}
                style={styles.textarea}
                placeholder="Add any additional notes or reason for visit..."
              />
            </div>
          </div>

          {/* Summary Card */}
          {(formData.patient || formData.doctor || formData.date) && (
            <div style={styles.summaryCard}>
              <h3 style={styles.summaryTitle}>Appointment Summary</h3>
              <div style={styles.summaryGrid}>
                <div>
                  <p style={styles.summaryLabel}>Patient</p>
                  <p style={styles.summaryValue}>
                    {patients.find((p) => p._id === formData.patient)?.name || '-'}
                  </p>
                </div>
                <div>
                  <p style={styles.summaryLabel}>Doctor</p>
                  <p style={styles.summaryValue}>
                    {doctors.find((d) => d._id === formData.doctor)?.name
                      ? `Dr. ${doctors.find((d) => d._id === formData.doctor).name}`
                      : '-'}
                  </p>
                </div>
                <div>
                  <p style={styles.summaryLabel}>Date</p>
                  <p style={styles.summaryValue}>
                    {formData.date
                      ? new Date(formData.date).toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                        })
                      : '-'}
                  </p>
                </div>
                <div>
                  <p style={styles.summaryLabel}>Time</p>
                  <p style={styles.summaryValue}>{formData.time || '-'}</p>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div style={styles.actions}>
            <button
              type="submit"
              disabled={loading || !formData.patient || !formData.doctor}
              style={{
                ...styles.submitButton,
                ...(loading || !formData.patient || !formData.doctor ? styles.submitButtonDisabled : {}),
              }}
            >
              {loading ? (
                <>
                  <div style={styles.spinnerSmall}></div>
                  {isEdit ? 'Updating...' : 'Scheduling...'}
                </>
              ) : (
                <span>{isEdit ? 'Update Appointment' : 'Schedule Appointment'}</span>
              )}
            </button>
            <Link to="/appointments" style={styles.cancelButton}>
              Cancel
            </Link>
          </div>
        </form>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default AppointmentForm;
