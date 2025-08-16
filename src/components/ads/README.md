# Ads Components

This directory contains the components for the Ads management page.

## Components

### AdsHeader
Displays the page title, subtitle, and "Add New Ad" button.

**Props:**
- `onAddNew: () => void` - Callback function for adding new ads

**Features:**
- Localized page title and subtitle
- Action button for creating new ads

### AdsFilters
Provides search and filter controls for the ads list.

**Props:**
- `searchTerm: string` - Current search term
- `statusFilter: string` - Current status filter
- `onSearchChange: (value: string) => void` - Search term change handler
- `onStatusChange: (value: string) => void` - Status filter change handler
- `onReset: () => void` - Reset filters handler

**Features:**
- Search input with placeholder
- Status filter dropdown (All, Active, Scheduled, Expired)
- Reset button
- Responsive design

### AdsStats
Displays statistics cards for ads.

**Props:**
- `ads: Ad[]` - Array of ads data

**Features:**
- Total ads count
- Active ads count
- Scheduled ads count
- Expired ads count
- Color-coded icons and styling

### AddAdModal
Modal component for creating new ads with multi-language support.

**Props:**
- `isOpen: boolean` - Controls modal visibility
- `onClose: () => void` - Callback function to close the modal

**Features:**
- Multi-language form fields (Arabic, English, Kurdish)
- Title and description inputs for each language
- Optional image URL input
- Start and end date pickers
- Form validation
- Redux integration for creating ads
- Loading states and error handling
- Responsive design with dark theme

## Table and Pagination

The Ads page now uses the reusable components from `src/components/ui/`:
- **Table**: Renders the ads data with custom column definitions
- **Pagination**: Handles page navigation

## Types

All components use the `Ad` interface from `src/types/ads.ts`:

```typescript
interface Ad {
  id: string;
  title: { ar: string; en: string; ku: string };
  description: { ar: string; en: string; ku: string };
  type: string;
  userId: string | null;
  image: string | null;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
}

interface CreateAd {
  title: { ar: string; en: string; ku: string };
  description: { ar: string; en: string; ku: string };
  type: string;
  image?: string;
  startDate?: string;
  endDate?: string;
}
```

## Redux Integration

The components integrate with Redux for state management:

- **fetchAds**: Async thunk for fetching ads from the API
- **createAd**: Async thunk for creating new ads
- **State management**: Loading states, error handling, and data persistence

## Localization

The components support multiple languages (Arabic, English, Kurdish) using `react-i18next`. Translation keys are defined in the locale files under the `ads` section.

## Usage

```tsx
import {
  AdsHeader,
  AdsFilters,
  AdsStats,
  AddAdModal,
} from '../components/ads';
import Table, { TableColumn } from '../components/ui/Table';
import Pagination from '../components/ui/Pagination';

// Use components with proper props
<AdsHeader onAddNew={handleAddNew} />
<AdsFilters {...filterProps} />
<AdsStats ads={ads} />
<Table columns={tableColumns} data={filteredAds} />
<Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />

// Modal for creating new ads
<AddAdModal
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
/>
```
