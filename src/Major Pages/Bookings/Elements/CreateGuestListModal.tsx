import React, { useState } from 'react';

export interface CreateGuestListModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNext: (mode: string) => void; 
}

type Guest = {
  firstName: string;
  lastName: string;
  gender: string;
  email: string;
  contactNumber: string;
};

interface Props {
  eventId: number;
  onSubmit: (guests: Guest[]) => Promise<void>;
  onUploadCsv?: (file: File) => Promise<void>;
}

const CreateGuestListModal: React.FC<Props> = ({ eventId, onSubmit, onUploadCsv }) => {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [newGuest, setNewGuest] = useState<Guest>({
    firstName: '',
    lastName: '',
    gender: '',
    email: '',
    contactNumber: ''
  });
  const [confirmChecked, setConfirmChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [csvFile, setCsvFile] = useState<File | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setNewGuest({
      ...newGuest,
      [e.target.name]: e.target.value
    });
  };

  const handleAddGuest = () => {
    if (newGuest.firstName && newGuest.email) {
      setGuests([...guests, newGuest]);
      setNewGuest({
        firstName: '',
        lastName: '',
        gender: '',
        email: '',
        contactNumber: ''
      });
    }
  };

  const handleDeleteGuest = (index: number) => {
    setGuests(guests.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!confirmChecked) return alert('Please confirm before submitting.');
    if (guests.length === 0) return alert('Add at least one guest.');

    setLoading(true);
    try {
      await onSubmit(guests);
      setGuests([]);
      setConfirmChecked(false);
      alert('Manual guests submitted successfully!');
    } catch (err: any) {
      console.error(err);
      alert('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const handleCsvUpload = async () => {
    if (!csvFile) return alert('Please select a CSV file.');
    if (!onUploadCsv) return alert('Upload handler is missing.');

    setLoading(true);
    try {
      await onUploadCsv(csvFile);
      alert('CSV uploaded successfully!');
      setCsvFile(null);
    } catch (err) {
      console.error(err);
      alert('CSV upload error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal">
      <h2>Create Guest List</h2>

      <div className="step-indicator">
        <span>Mode of Creation</span> ➜ <span><b>Creating List</b></span>
      </div>

      <table>
        <thead>
          <tr>
            <th>First Name</th><th>Last Name</th><th>Gender</th><th>Email</th><th>SMS</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {guests.map((guest, index) => (
            <tr key={index}>
              <td>{guest.firstName}</td>
              <td>{guest.lastName}</td>
              <td>{guest.gender}</td>
              <td>{guest.email}</td>
              <td>{guest.contactNumber}</td>
              <td><button onClick={() => handleDeleteGuest(index)}>🗑️</button></td>
            </tr>
          ))}
          <tr>
            <td><input name="firstName" value={newGuest.firstName} onChange={handleInputChange} /></td>
            <td><input name="lastName" value={newGuest.lastName} onChange={handleInputChange} /></td>
            <td>
              <select name="gender" value={newGuest.gender} onChange={handleInputChange}>
                <option value="">--</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </td>
            <td><input name="email" type="email" value={newGuest.email} onChange={handleInputChange} /></td>
            <td><input name="contactNumber" value={newGuest.contactNumber} onChange={handleInputChange} /></td>
            <td><button onClick={handleAddGuest}>➕</button></td>
          </tr>
        </tbody>
      </table>

      <label>
        <input
          type="checkbox"
          checked={confirmChecked}
          onChange={() => setConfirmChecked(!confirmChecked)}
        />
        I confirm that the encoded guest list is accurate and up to date.
      </label>

      <div style={{ marginTop: '1rem' }}>
        <label>Upload CSV: </label>
        <input
          type="file"
          accept=".csv"
          onChange={(e) => setCsvFile(e.target.files?.[0] || null)}
        />
        <button onClick={handleCsvUpload} disabled={loading || !csvFile}>Upload CSV</button>
      </div>

      <div className="modal-actions">
        <button onClick={() => console.log('Back clicked')}>Back</button>
        <button onClick={handleSubmit} disabled={loading || !confirmChecked}>
          {loading ? 'Submitting...' : 'Create Guest List'}
        </button>
      </div>
    </div>
  );
};

export default CreateGuestListModal;