import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import patientService from '../../services/patientService';

const PatientForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    bloodGroup: '',
    address: '',
    emergencyContact: '',
    medicalHistory: '',
  });
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(isEdit);
  const [error, setError] = useState('');

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const genders = ['Male', 'Female', 'Other'];

  useEffect(() => {
    if (isEdit) {
      fetchPatient();
    }
  }, [id]);

  const fetchPatient = async () => {
    try {
      const response = await patientService.getById(id);
      const patient = response.data || response;
      setFormData({
        name: patient.name || '',
        email: patient.email || '',
        phone: patient.phone || '',
        dateOfBirth: patient.dateOfBirth ? new Date(patient.dateOfBirth).toISOString().split('T')[0] : '',
        gender: patient.gender || '',
        bloodGroup: patient.bloodGroup || '',
        address: patient.address || '',
        emergencyContact: patient.emergencyContact || '',
        medicalHistory: patient.medicalHistory || '',
      });
    } catch (error) {
      console.error('Error fetching patient:', error);
      setError('Failed to fetch patient details');
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
        await patientService.update(id, formData);
      } else {
        await patientService.create(formData);
      }
      navigate('/patients');
    } catch (error) {
      console.error('Error saving patient:', error);
      setError(error.response?.data?.message || 'Failed to save patient');
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
    actions: {
      display: 'flex',
      flexDirection: 'row',
      gap: '12px',
      paddingTop: '24px',
      borderTop: '1px solid #f3f4f6',
    },
    submitButton: {
      padding: '12px 24px',
      background: 'linear-gradient(to right, #10b981, #059669)',
      color: 'white',
      fontWeight: '500',
      borderRadius: '12px',
      boxShadow: '0 10px 15px -3px rgba(16, 185, 129, 0.3)',
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
      border: '4px solid #10b981',
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
          <p style={styles.loadingText}>Loading patient details...</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Page Header */}
      <div style={styles.header}>
        <Link to="/patients" style={styles.backLink}>
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Patients
        </Link>
        <h1 style={styles.pageTitle}>
          {isEdit ? 'Edit Patient' : 'Add New Patient'}
        </h1>
        <p style={styles.pageSubtitle}>
          {isEdit ? 'Update patient information' : 'Fill in the details to register a new patient'}
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
            {/* Name */}
            <div style={styles.formGroupFull}>
              <label style={styles.label}>
                Full Name <span style={styles.required}>*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                style={styles.input}
                placeholder="Enter patient's full name"
              />
            </div>

            {/* Email */}
            <div>
              <label style={styles.label}>Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                style={styles.input}
                placeholder="patient@example.com"
              />
            </div>

            {/* Phone */}
            <div>
              <label style={styles.label}>
                Phone Number <span style={styles.required}>*</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                style={styles.input}
                placeholder="+1 (555) 000-0000"
              />
            </div>

            {/* Date of Birth */}
            <div>
              <label style={styles.label}>
                Date of Birth <span style={styles.required}>*</span>
              </label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                required
                style={styles.input}
              />
            </div>

            {/* Gender */}
            <div>
              <label style={styles.label}>
                Gender <span style={styles.required}>*</span>
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
                style={styles.select}
              >
                <option value="">Select gender</option>
                {genders.map((gender) => (
                  <option key={gender} value={gender.toLowerCase()}>
                    {gender}
                  </option>
                ))}
              </select>
            </div>

            {/* Blood Group */}
            <div>
              <label style={styles.label}>Blood Group</label>
              <select
                name="bloodGroup"
                value={formData.bloodGroup}
                onChange={handleChange}
                style={styles.select}
              >
                <option value="">Select blood group</option>
                {bloodGroups.map((group) => (
                  <option key={group} value={group}>
                    {group}
                  </option>
                ))}
              </select>
            </div>

            {/* Emergency Contact */}
            <div>
              <label style={styles.label}>Emergency Contact</label>
              <input
                type="tel"
                name="emergencyContact"
                value={formData.emergencyContact}
                onChange={handleChange}
                style={styles.input}
                placeholder="Emergency contact number"
              />
            </div>

            {/* Address */}
            <div style={styles.formGroupFull}>
              <label style={styles.label}>Address</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows={2}
                style={styles.textarea}
                placeholder="Enter patient's address"
              />
            </div>

            {/* Medical History */}
            <div style={styles.formGroupFull}>
              <label style={styles.label}>Medical History</label>
              <textarea
                name="medicalHistory"
                value={formData.medicalHistory}
                onChange={handleChange}
                rows={3}
                style={styles.textarea}
                placeholder="Enter any relevant medical history, allergies, or conditions"
              />
            </div>
          </div>

          {/* Actions */}
          <div style={styles.actions}>
            <button
              type="submit"
              disabled={loading}
              style={{
                ...styles.submitButton,
                ...(loading ? styles.submitButtonDisabled : {}),
              }}
            >
              {loading ? (
                <>
                  <div style={styles.spinnerSmall}></div>
                  Saving...
                </>
              ) : (
                <span>{isEdit ? 'Update Patient' : 'Add Patient'}</span>
              )}
            </button>
            <Link to="/patients" style={styles.cancelButton}>
              Cancel
            </Link>
          </div>
        </form>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default PatientForm;
