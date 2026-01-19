import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import doctorService from '../../services/doctorService';

const DoctorForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    specialization: '',
    experience: '',
    qualification: '',
    address: '',
  });
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(isEdit);
  const [error, setError] = useState('');

  const specializations = [
    'Cardiology',
    'Neurology',
    'Orthopedics',
    'Pediatrics',
    'Dermatology',
    'Ophthalmology',
    'Psychiatry',
    'Radiology',
    'Surgery',
    'General Medicine',
  ];

  useEffect(() => {
    if (isEdit) {
      fetchDoctor();
    }
  }, [id]);

  const fetchDoctor = async () => {
    try {
      const response = await doctorService.getById(id);
      const doctor = response.data || response;
      setFormData({
        name: doctor.name || '',
        email: doctor.email || '',
        phone: doctor.phone || '',
        specialization: doctor.specialization || '',
        experience: doctor.experience || '',
        qualification: doctor.qualification || '',
        address: doctor.address || '',
      });
    } catch (error) {
      console.error('Error fetching doctor:', error);
      setError('Failed to fetch doctor details');
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
        await doctorService.update(id, formData);
      } else {
        await doctorService.create(formData);
      }
      navigate('/doctors');
    } catch (error) {
      console.error('Error saving doctor:', error);
      setError(error.response?.data?.message || 'Failed to save doctor');
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
      padding: '24px',
    },
    formCardLarge: {
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
      flexDirection: 'column',
      gap: '12px',
      paddingTop: '24px',
      borderTop: '1px solid #f3f4f6',
    },
    actionsDesktop: {
      display: 'flex',
      flexDirection: 'row',
      gap: '12px',
      paddingTop: '24px',
      borderTop: '1px solid #f3f4f6',
    },
    submitButton: {
      padding: '12px 24px',
      background: 'linear-gradient(to right, #3b82f6, #2563eb)',
      color: 'white',
      fontWeight: '500',
      borderRadius: '12px',
      boxShadow: '0 10px 15px -3px rgba(59, 130, 246, 0.3)',
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
      border: '4px solid #3b82f6',
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
          <p style={styles.loadingText}>Loading doctor details...</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Page Header */}
      <div style={styles.header}>
        <Link to="/doctors" style={styles.backLink}>
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Doctors
        </Link>
        <h1 style={styles.pageTitle}>
          {isEdit ? 'Edit Doctor' : 'Add New Doctor'}
        </h1>
        <p style={styles.pageSubtitle}>
          {isEdit ? 'Update doctor information' : 'Fill in the details to add a new doctor'}
        </p>
      </div>

      {/* Form */}
      <div style={{ ...styles.formCard, ...styles.formCardLarge }}>
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
                placeholder="Enter doctor's full name"
              />
            </div>

            {/* Email */}
            <div>
              <label style={styles.label}>
                Email Address <span style={styles.required}>*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                style={styles.input}
                placeholder="doctor@example.com"
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

            {/* Specialization */}
            <div>
              <label style={styles.label}>
                Specialization <span style={styles.required}>*</span>
              </label>
              <select
                name="specialization"
                value={formData.specialization}
                onChange={handleChange}
                required
                style={styles.select}
              >
                <option value="">Select specialization</option>
                {specializations.map((spec) => (
                  <option key={spec} value={spec}>
                    {spec}
                  </option>
                ))}
              </select>
            </div>

            {/* Experience */}
            <div>
              <label style={styles.label}>Years of Experience</label>
              <input
                type="number"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                min="0"
                style={styles.input}
                placeholder="Enter years of experience"
              />
            </div>

            {/* Qualification */}
            <div style={styles.formGroupFull}>
              <label style={styles.label}>Qualification</label>
              <input
                type="text"
                name="qualification"
                value={formData.qualification}
                onChange={handleChange}
                style={styles.input}
                placeholder="e.g., MD, MBBS, PhD"
              />
            </div>

            {/* Address */}
            <div style={styles.formGroupFull}>
              <label style={styles.label}>Address</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows={3}
                style={styles.textarea}
                placeholder="Enter doctor's address"
              />
            </div>
          </div>

          {/* Actions */}
          <div style={styles.actionsDesktop}>
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
                <span>{isEdit ? 'Update Doctor' : 'Add Doctor'}</span>
              )}
            </button>
            <Link to="/doctors" style={styles.cancelButton}>
              Cancel
            </Link>
          </div>
        </form>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default DoctorForm;
