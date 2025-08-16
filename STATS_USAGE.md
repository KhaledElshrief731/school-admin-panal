# Dashboard Stats Usage Guide

This guide explains how to use the dashboard stats functionality that integrates with the API endpoint `https://mahfouzapp.com/dashboard/stats/summary`.

## API Response Structure

### Dashboard Summary Stats
```json
{
  "code": 200,
  "data": {
    "totalUsers": 19,
    "totalSchools": 286,
    "subscriptions": {
      "paid": 0,
      "pending": 3,
      "expired": []
    }
  },
  "message": {
    "arabic": "تم جلب الإحصائيات بنجاح",
    "english": "Dashboard stats fetched successfully"
  }
}
```

### Monthly Users Stats
```json
{
  "code": 200,
  "data": [
    {
      "month": 1,
      "count": 0
    },
    {
      "month": 7,
      "count": 19
    }
  ],
  "message": {
    "arabic": "إحصائيات المستخدمين الشهرية",
    "english": "Monthly user statistics"
  }
}
```

### Monthly Subscriptions Stats
```json
{
  "code": 200,
  "data": [
    {
      "month": 1,
      "paid": 0,
      "pending": 0
    },
    {
      "month": 7,
      "paid": 0,
      "pending": 3
    }
  ],
  "message": {
    "arabic": "إحصائيات الاشتراكات الشهرية",
    "english": "Monthly subscription statistics"
  }
}
```

## Available Components and Hooks

### 1. Custom Hook: `useStats`

The `useStats` hook provides easy access to dashboard statistics throughout the application.

```tsx
import { useStats } from '../hooks/useStats';

const MyComponent = () => {
  const { dashboardStats, loading, error, refreshStats, clearError } = useStats();

  return (
    <div>
      {loading && <div>Loading...</div>}
      {error && <div>Error: {error}</div>}
      {dashboardStats && (
        <div>
          <p>Total Users: {dashboardStats.totalUsers}</p>
          <p>Total Schools: {dashboardStats.totalSchools}</p>
          <p>Paid Subscriptions: {dashboardStats.subscriptions.paid}</p>
          <p>Pending Subscriptions: {dashboardStats.subscriptions.pending}</p>
        </div>
      )}
      <button onClick={refreshStats}>Refresh Stats</button>
    </div>
  );
};
```

### 2. Stats Summary Component

A reusable component for displaying stats in a grid layout.

```tsx
import StatsSummary from '../components/dashboard/StatsSummary';

const MyPage = () => {
  return (
    <div>
      <StatsSummary showTitle={true} className="my-4" />
    </div>
  );
};
```

### 3. Direct Redux Usage

You can also use the Redux store directly:

```tsx
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { 
  fetchDashboardStats, 
  selectDashboardStats, 
  selectStatsLoading, 
  selectStatsError 
} from '../store/slices/statsSlice';

const MyComponent = () => {
  const dispatch = useAppDispatch();
  const dashboardStats = useAppSelector(selectDashboardStats);
  const loading = useAppSelector(selectStatsLoading);
  const error = useAppSelector(selectStatsError);

  useEffect(() => {
    dispatch(fetchDashboardStats());
  }, [dispatch]);

  // ... rest of component
};
```

## Redux Store Structure

The stats slice provides the following state:

```typescript
interface StatsState {
  dashboardStats: DashboardStats | null;
  loading: boolean;
  error: string | null;
}

interface DashboardStats {
  totalUsers: number;
  totalSchools: number;
  subscriptions: {
    paid: number;
    pending: number;
    expired: any[];
  };
}
```

## Available Actions

- `fetchDashboardStats()` - Fetches dashboard stats from the API
- `clearStatsError()` - Clears any error state
- `clearStatsData()` - Clears the stats data

## Available Selectors

- `selectDashboardStats` - Returns the dashboard stats data
- `selectStatsLoading` - Returns the loading state
- `selectStatsError` - Returns any error message

## Error Handling

The system handles various error scenarios:

1. **Network errors** - Displays appropriate error messages
2. **Authentication errors** - Handles missing or invalid tokens
3. **API errors** - Displays server-side error messages
4. **Loading states** - Shows loading indicators during API calls

## Usage Examples

### Basic Usage in Dashboard

```tsx
import { useStats } from '../hooks/useStats';

const Dashboard = () => {
  const { dashboardStats, loading, error, refreshStats } = useStats();

  return (
    <div>
      {error && <div className="error">{error}</div>}
      <div className="stats-grid">
        <div>Users: {loading ? "..." : dashboardStats?.totalUsers}</div>
        <div>Schools: {loading ? "..." : dashboardStats?.totalSchools}</div>
        <div>Paid Subscriptions: {loading ? "..." : dashboardStats?.subscriptions.paid}</div>
        <div>Pending Subscriptions: {loading ? "..." : dashboardStats?.subscriptions.pending}</div>
      </div>
      <button onClick={refreshStats} disabled={loading}>
        Refresh
      </button>
    </div>
  );
};
```

### Using in Other Pages

```tsx
import StatsSummary from '../components/dashboard/StatsSummary';

const ReportsPage = () => {
  return (
    <div>
      <h1>Reports</h1>
      <StatsSummary showTitle={false} />
      {/* Other content */}
    </div>
  );
};
```

### Chart Component with Multiple Data Sources

The RevenueChart component now supports multiple data sources with tab switching:

```tsx
import RevenueChart from '../components/dashboard/RevenueChart';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('شهري');
  
  return (
    <RevenueChart 
      activeTab={activeTab} 
      onTabChange={setActiveTab}
    />
  );
};
```

**Available Tabs:**
- `شهري` - Shows monthly users data (default)
- `المستخدمين` - Shows monthly users data
- `الاشتراكات` - Shows monthly subscriptions data with paid/pending breakdown

**Chart Features:**
- Automatic data fetching for both users and subscriptions
- Loading states and error handling
- Different chart types based on selected tab
- Arabic month names
- Responsive design

## Authentication

The stats API requires authentication. The system automatically:

1. Retrieves the token from `localStorage`
2. Includes it in the Authorization header
3. Handles authentication errors gracefully

Make sure the user is logged in before accessing stats functionality.

## Performance Considerations

- Stats are cached in Redux store
- The `useStats` hook automatically fetches data if not already loaded
- Manual refresh is available via `refreshStats()` function
- Loading states prevent unnecessary re-renders 