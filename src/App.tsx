import { useEffect } from 'react';
import { App as AntApp, ConfigProvider } from 'antd';

import { useAppSelector } from '@/app/hooks';
import {
  persistAnnouncementDismissed,
  persistTheme,
  selectAnnouncementDismissed,
  selectTheme,
} from '@/features/ui/uiSlice';
import { buildAntdTheme } from '@/lib/antdTheme';
import AppLayout from '@/components/layout/AppLayout';
import AppRoutes from '@/routes/AppRoutes';

export default function App() {
  const theme = useAppSelector(selectTheme);
  const announcementDismissed = useAppSelector(selectAnnouncementDismissed);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    persistTheme(theme);
  }, [theme]);

  useEffect(() => {
    persistAnnouncementDismissed(announcementDismissed);
  }, [announcementDismissed]);

  return (
    <ConfigProvider theme={buildAntdTheme(theme)}>
      {/* AntApp provides the context that `useMessage`/`useModal` need. */}
      <AntApp>
        <AppLayout>
          <AppRoutes />
        </AppLayout>
      </AntApp>
    </ConfigProvider>
  );
}
