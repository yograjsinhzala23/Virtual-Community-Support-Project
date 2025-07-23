# Error Handling Fix Guide

## Issues Identified

### 1. 404 API Errors
The following API endpoints were returning 404 errors:
- ~~`/api/AdminUser/UserDetailList`~~ → **FIXED**: Now using `/api/User/UserDetailList`
- ~~`/api/Mission/GetMissionSkillList`~~ → **FIXED**: Now using `/api/MissionSkill/GetMissionSkillList`
- ~~`/api/Mission/GetMissionThemeList`~~ → **FIXED**: Now using `/api/MissionTheme/GetMissionThemeList`
- `/api/Mission/MissionApplicationList`

**Root Cause**: The backend server at `http://localhost:56577` was expecting different endpoint paths than what the frontend was calling.

**Fixed**: Updated the API constants and service methods to match the backend endpoints.

### 2. TypeError: Cannot read properties of undefined (reading 'message')
**Root Cause**: When HTTP requests fail (especially 404 errors), the error object structure is different:
- Success case: `err.error.message` exists
- 404 case: `err.error` might be undefined, causing the TypeError

## Files Fixed

### 1. `src/app/main/components/admin-side/user/user.component.ts`
- Fixed error handling in `fetchUserList()` method
- Fixed error handling in `deleteUser()` method

### 2. `src/app/main/components/admin-side/mission-application/mission-application.component.ts`
- Fixed error handling in `fetchMissionApplicationList()` method
- Fixed error handling in `approveMissionApplication()` method
- Fixed error handling in `deleteMissionApplication()` method

### 3. `src/app/main/components/admin-side/mission/update-mission/update-mission.component.ts`
- Fixed error handling in `getMissionSkillList()` method
- Fixed error handling in `getMissionThemeList()` method
- Fixed error handling in `onSubmit()` method (upload image and update mission)

### 4. Created utility: `src/app/main/utils/error-handler.util.ts`
- Provides a safe way to extract error messages from HTTP errors

### 5. `src/app/main/services/mission.service.ts`
- Fixed `getMissionThemeList()` method to use correct endpoint `/api/MissionTheme/GetMissionThemeList`
- Fixed `getMissionSkillList()` method to use correct endpoint `/api/MissionSkill/GetMissionSkillList`

### 6. `src/app/main/constants/api.constants.ts`
- Removed incorrect endpoints from MISSION section
- Updated to use dedicated MISSION_THEME and MISSION_SKILL sections

### 7. `src/app/main/components/admin-side/mission/add-mission/add-mission.component.ts`
- Fixed mission theme and skills not working by switching from MissionService to CommonService
- Updated `getMissionThemeList()` to use `_commonService.getMissionThemeList()`
- Updated `getMissionSkillList()` to use `_commonService.getMissionSkillList()`
- Fixed reactive form disabled attribute warnings
- Improved error handling with safe error message extraction

## Solution Applied

### Before (Problematic Code):
```typescript
(err) => this._toast.error({ detail: "ERROR", summary: err.error.message, duration: APP_CONFIG.toastDuration })
```

### After (Fixed Code):
```typescript
(err) => {
  const errorMessage = err?.error?.message || err?.message || 'An error occurred while fetching user list'
  this._toast.error({ detail: "ERROR", summary: errorMessage, duration: APP_CONFIG.toastDuration })
}
```

## Next Steps

### 1. Backend Server
Ensure the backend server is running at `http://localhost:56577` and has the following endpoints:
- `GET /api/User/UserDetailList`
- `GET /api/Mission/MissionApplicationList`

### 2. Additional Files to Fix
The following files still have similar error handling issues and should be updated:
- `src/app/main/components/user-edit-profile/user-edit-profile.component.ts`
- `src/app/main/components/volunteering-timesheet/volunteering-timesheet.component.ts`
- `src/app/main/components/volunteering-mission/volunteering-mission.component.ts`
- `src/app/main/components/home/home.component.ts`
- `src/app/main/components/admin-side/header/header.component.ts`
- `src/app/main/components/admin-side/mission-skill/missionskill.component.ts`
- `src/app/main/components/admin-side/mission-skill/add-edit-mission-skill/add-edit-mission-skill.component.ts`
- `src/app/main/components/admin-side/user/update-user/update-user.component.ts`
- `src/app/main/components/admin-side/mission-theme/missiontheme.component.ts`
- `src/app/main/components/admin-side/profile/profile.component.ts`
- `src/app/main/components/admin-side/mission-theme/add-edit-mission-theme/add-edit-mission-theme.component.ts`
- `src/app/main/components/admin-side/mission/mission.component.ts`
- `src/app/main/components/admin-side/mission/add-mission/add-mission.component.ts`

### 3. Using the Utility Function
For future error handling, use the utility function:
```typescript
import { getErrorMessage } from 'src/app/main/utils/error-handler.util';

// In error handlers:
(err) => {
  const errorMessage = getErrorMessage(err, 'An error occurred while fetching data');
  this._toast.error({ detail: "ERROR", summary: errorMessage, duration: APP_CONFIG.toastDuration });
}
```

## Testing
1. Start the backend server
2. Test the application
3. Verify that error messages are displayed properly without TypeErrors
4. Check that 404 errors show appropriate messages instead of crashing 