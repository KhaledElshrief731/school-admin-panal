import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getLocalizedRole, getLocalizedGender } from '../../utils/i18nUtils';
import { useAppSelector, useAppDispatch } from '../../hooks/redux';
import { verifyUser } from '../../store/slices/usersSlices';

const UsersDetails: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [verifyLoading, setVerifyLoading] = React.useState(false);
  const [verifyError, setVerifyError] = React.useState<string | null>(null);
  const [verifySuccess, setVerifySuccess] = React.useState(false);

  const user = useAppSelector(state => state.users.users.find(u => u.id === id));

  if (!user) {
    return (
      <div className="p-6 text-center text-gray-400">
        {t('common.loading')} / {t('users.notFound')}
      </div>
    );
  }

  const handleVerify = async () => {
    if (!id) return;
    setVerifyLoading(true);
    setVerifyError(null);
    setVerifySuccess(false);
    try {
      await dispatch(verifyUser(id)).unwrap();
      setVerifySuccess(true);
    } catch (err: any) {
      setVerifyError(err || t('errors.default'));
    } finally {
      setVerifyLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-6 text-blue-500 hover:underline text-sm"
      >
        ← {t('common.back')}
      </button>

      <h1 className="text-2xl font-bold text-white mb-6">{t('pages.userDetails')}</h1>

      <div className="bg-dark-300 rounded-xl p-6 shadow space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
          <UserInfo label={t('table.name')} value={user.userName} />
          <UserInfo label={t('table.phone')} value={user.phone} />
          <UserInfo label={t('table.role')} value={getLocalizedRole(user.role, t)} />
          <UserInfo label={t('table.city')} value={user.city?.name || '-'} />
          <UserInfo label={t('table.country')} value={user.country?.name || '-'} />
          <UserInfo label={t('table.region')} value={user.region || '-'} />
          <UserInfo label={t('table.dateOfBirth')} value={user.dateOfBirth || '-'} />
          <UserInfo label={t('table.gender')} value={user.gender ? getLocalizedGender(user.gender, t) : '-'} />
        </div>

        <div className="pt-4 border-t border-dark-200">
          <button
            onClick={handleVerify}
            disabled={verifyLoading}
            className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg transition-colors disabled:opacity-50"
          >
            {verifyLoading ? t('common.processing') : t('common.verify', 'تفعيل المستخدم')}
          </button>

          {verifyError && (
            <div className="mt-4 bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-lg">
              {verifyError}
            </div>
          )}
          {verifySuccess && (
            <div className="mt-4 bg-green-500/10 border border-green-500/20 text-green-400 text-sm p-3 rounded-lg">
              {t('messages.updateSuccess')}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const UserInfo = ({ label, value }: { label: string; value: string }) => (
  <div>
    <span className="block text-sm text-gray-400 mb-1">{label}:</span>
    <span className="text-white font-medium">{value}</span>
  </div>
);

export default UsersDetails;
