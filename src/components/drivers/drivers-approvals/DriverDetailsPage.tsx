import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDriverById } from '../../../store/slices/driversSlice';
import { RootState } from '../../../store';
import type { AppDispatch } from '../../../store';
import { User, Car, BadgeCheck } from 'lucide-react'; // Example icons

// Add the type for the driver by id response
type DriverByIdResponse = {
  code: number;
  data: any;
  message: {
    arabic: string;
    english: string;
  };
};

const DriverDetailsPage: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  // Use a type assertion for the selector
  const { selectedDriver, selectedDriverLoading, selectedDriverError } = useSelector(
    (state: RootState) => state.drivers
  ) as {
    selectedDriver: DriverByIdResponse | null;
    selectedDriverLoading: boolean;
    selectedDriverError: string | null;
  };

  const [showStatusMessage, setShowStatusMessage] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalImages, setModalImages] = useState<string[]>([]);
  const [modalIndex, setModalIndex] = useState(0);

  const openImageModal = (images: string[], idx: number) => {
    setModalImages(images);
    setModalIndex(idx);
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  const showPrev = () => setModalIndex((prev) => (prev === 0 ? modalImages.length - 1 : prev - 1));
  const showNext = () => setModalIndex((prev) => (prev === modalImages.length - 1 ? 0 : prev + 1));

  useEffect(() => {
    if (id) dispatch(fetchDriverById(id));
  }, [id, dispatch]);

  useEffect(() => {
    if (selectedDriver?.message?.arabic || selectedDriver?.message?.english) {
      setShowStatusMessage(true);
      const timer = setTimeout(() => setShowStatusMessage(false), 4000); // 4 seconds
      return () => clearTimeout(timer);
    }
  }, [selectedDriver?.message?.arabic, selectedDriver?.message?.english]);

  if (selectedDriverLoading) return <div>Loading...</div>;
  if (selectedDriverError) return <div>Error: {selectedDriverError}</div>;
  if (!selectedDriver) return <div>لا توجد بيانات لهذا السائق</div>;

  // Extract driver info fields from selectedDriver.data
  const driver = selectedDriver.data;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h2 className="text-3xl font-extrabold mb-8 flex items-center gap-2">
        <User className="w-8 h-8 text-primary-500" /> {t('drivers.driverDetails')}
      </h2>

      {/* Status Message */}
      {showStatusMessage && (
        <div className="bg-green-100 text-green-800 p-4 rounded-lg mb-6 shadow flex flex-col md:flex-row md:items-center md:gap-4 transition-opacity duration-500">
          <span className="font-bold">{selectedDriver?.message?.arabic}</span>
          <span className="text-gray-500 text-sm">{selectedDriver?.message?.english}</span>
        </div>
      )}

      {/* Driver Info Card */}
      <div className="bg-dark-200 p-6 rounded-xl shadow mb-8">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <User className="w-6 h-6 text-primary-400" /> {t('drivers.driverData')}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="mb-2 flex items-center gap-2">
              {driver.user?.image && (
                <img
                  src={driver.user.image.startsWith('/') ? `https://mahfouzapp.com${driver.user.image}` : driver.user.image}
                  alt="user-avatar"
                  className="w-10 h-10 rounded-full object-cover border border-gray-400"
                />
              )}
              <span className="font-semibold">{t('table.userName')}:</span> {driver.user?.userName || '-'}
            </div>
            <div className="mb-2"><span className="font-semibold">{t('table.phone')}:</span> {driver.user?.phone || '-'}</div>
            <div className="mb-2"><span className="font-semibold">{t('table.region')}:</span> {driver.user?.region || '-'}</div>
            <div className="mb-2"><span className="font-semibold">{t('table.gender')}:</span> {driver.user?.gender || '-'}</div>
            <div className="mb-2"><span className="font-semibold">{t('table.dateOfBirth')}:</span> {driver.user?.dateOfBirth ? new Date(driver.user.dateOfBirth).toLocaleDateString() : '-'}</div>
            <div className="mb-2"><span className="font-semibold">{t('table.city')}:</span> {driver.user?.city?.name || '-'}</div>
            <div className="mb-2"><span className="font-semibold">{t('table.country')}:</span> {driver.user?.country?.name || '-'}</div>
          </div>
          <div>
            <div className="mb-2 flex items-center gap-2"><span className="font-semibold">{t('drivers.verifiedDriver')}:</span> <span className={`px-2 py-1 rounded text-xs font-bold ${driver.isVerified ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>{driver.isVerified ? t('common.yes') : t('common.no')}</span></div>
            <div className="mb-2 flex items-center gap-2"><span className="font-semibold">{t('drivers.pausedDriver')}:</span> <span className={`px-2 py-1 rounded text-xs font-bold ${driver.isPause ? 'bg-yellow-500 text-black' : 'bg-green-500 text-white'}`}>{driver.isPause ? t('common.yes') : t('common.no')}</span></div>
            <div className="mb-2"><span className="font-semibold">{t('drivers.averageRating')}:</span> {driver.avgRate !== null && driver.avgRate !== undefined ? driver.avgRate : '-'}</div>
            <div className="mb-2"><span className="font-semibold">{t('drivers.vehicleName')}:</span> {Array.isArray(driver.DriverVehicle) && driver.DriverVehicle.length > 0 ? driver.DriverVehicle[0].carModel || '-' : '-'}</div>
           
          </div>
        </div>
      </div>

      {/* Driver Vehicle Details */}
      {Array.isArray(driver.DriverVehicle) && driver.DriverVehicle.length > 0 && (
        <div className="bg-dark-200 p-6 rounded-xl shadow mb-8">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Car className="w-6 h-6 text-primary-400" /> {t('drivers.vehicleDetails')}
          </h3>
          <table className="w-full text-left text-white">
            <thead>
              <tr className="bg-dark-300">
                <th className="py-2 px-3">{t('users.vehicleModel')}</th>
                <th className="py-2 px-3">{t('table.date')}</th>
                <th className="py-2 px-3">{t('users.vehicleColor')}</th>
                <th className="py-2 px-3">{t('users.keyNumber')}</th>
                <th className="py-2 px-3">{t('table.createdAt')}</th>
                <th className="py-2 px-3">{t('table.updatedAt')}</th>
              </tr>
            </thead>
            <tbody>
              {driver.DriverVehicle.map((v: any, idx: number) => (
                <tr key={v.id || idx} className="border-b border-dark-300">
                  <td className="py-2 px-3">{v.carModel || '-'}</td>
                  <td className="py-2 px-3">{v.modelYear || '-'}</td>
                  <td className="py-2 px-3">{v.color || '-'}</td>
                  <td className="py-2 px-3">{v.keyNumber || '-'}</td>
                  <td className="py-2 px-3">{v.createdAt ? new Date(v.createdAt).toLocaleString() : '-'}</td>
                  <td className="py-2 px-3">{v.updatedAt ? new Date(v.updatedAt).toLocaleString() : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Document Images */}
      <div className="bg-dark-200 p-6 rounded-xl shadow mb-8">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <BadgeCheck className="w-6 h-6 text-primary-400" /> {t('drivers.driverDocuments')}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Home Pictures */}
          {Array.isArray(driver.homePicture) && driver.homePicture.length > 0 && (
            <div>
              <div className="font-semibold mb-2">{t('drivers.homePictures')}</div>
              <div className="flex flex-wrap gap-2">
                {driver.homePicture.map((pic: string, idx: number) => (
                  <img
                    key={idx}
                    src={pic.startsWith('/') ? `https://mahfouzapp.com${pic}` : pic}
                    alt={`home-${idx}`}
                    className="w-24 h-24 object-cover rounded-lg border-2 border-gray-300 shadow hover:scale-105 transition-transform cursor-pointer"
                    onClick={() => openImageModal(driver.homePicture, idx)}
                  />
                ))}
              </div>
            </div>
          )}
          {/* Driving License */}
          {Array.isArray(driver.drivingLicense) && driver.drivingLicense.length > 0 && (
            <div>
              <div className="font-semibold mb-2">{t('drivers.drivingLicense')}</div>
              <div className="flex flex-wrap gap-2">
                {driver.drivingLicense.map((pic: string, idx: number) => (
                  <img
                    key={idx}
                    src={pic.startsWith('/') ? `https://mahfouzapp.com${pic}` : pic}
                    alt={`driving-license-${idx}`}
                    className="w-24 h-24 object-cover rounded-lg border-2 border-gray-300 shadow hover:scale-105 transition-transform cursor-pointer"
                    onClick={() => openImageModal(driver.drivingLicense, idx)}
                  />
                ))}
              </div>
            </div>
          )}
          {/* Personal Card */}
          {Array.isArray(driver.personalCard) && driver.personalCard.length > 0 && (
            <div>
              <div className="font-semibold mb-2">{t('drivers.personalCard')}</div>
              <div className="flex flex-wrap gap-2">
                {driver.personalCard.map((pic: string, idx: number) => (
                  <img
                    key={idx}
                    src={pic.startsWith('/') ? `https://mahfouzapp.com${pic}` : pic}
                    alt={`personal-card-${idx}`}
                    className="w-24 h-24 object-cover rounded-lg border-2 border-gray-300 shadow hover:scale-105 transition-transform cursor-pointer"
                    onClick={() => openImageModal(driver.personalCard, idx)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80"
          onClick={e => {
            if (e.target === e.currentTarget) closeModal();
          }}
        >
          <button
            className="absolute top-4 right-4 text-white text-3xl"
            onClick={closeModal}
            aria-label="Close"
          >×</button>
          <button
            className="absolute left-4 text-white text-3xl"
            onClick={showPrev}
            aria-label="Previous"
          >›</button>
          <img
            src={modalImages[modalIndex].startsWith('/') ? `https://mahfouzapp.com${modalImages[modalIndex]}` : modalImages[modalIndex]}
            alt={t('common.view')}
            className="max-h-[80vh] max-w-[90vw] rounded-lg shadow-lg"
          />
          <button
            className="absolute right-4 text-white text-3xl"
            style={{ top: '50%' }}
            onClick={showNext}
            aria-label="Next"
          >‹</button>
        </div>
      )}
    </div>
  );
};

export default DriverDetailsPage;
