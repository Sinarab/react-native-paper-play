import * as React from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { createDrawerNavigator } from '@react-navigation/drawer';
import {
  InitialState,
  NavigationContainer,
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
} from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { useKeepAwake } from 'expo-keep-awake';
import {
  PaperProvider,
  MD3DarkTheme,
  MD3LightTheme,
  MD2DarkTheme,
  MD2LightTheme,
  MD2Theme,
  MD3Theme,
  useTheme,
  adaptNavigationTheme,
  configureFonts,
} from 'react-native-paper';
import { SafeAreaInsetsContext } from 'react-native-safe-area-context';

import DrawerItems from './DrawerItems';
import App from './RootNavigator';

const PERSISTENCE_KEY = 'NAVIGATION_STATE';
const PREFERENCES_KEY = 'APP_PREFERENCES';

export const PreferencesContext = React.createContext<{
  toggleTheme: () => void;
  toggleThemeVersion: () => void;
  toggleCollapsed: () => void;
  toggleCustomFont: () => void;
  toggleRippleEffect: () => void;
  customFontLoaded: boolean;
  rippleEffectEnabled: boolean;
  collapsed: boolean;
  theme: MD2Theme | MD3Theme;
} | null>(null);

export const useExampleTheme = () => useTheme<MD2Theme | MD3Theme>();

const Drawer = createDrawerNavigator<{ Home: undefined }>();

export default function PaperExample() {
  useKeepAwake();

  const [fontsLoaded] = useFonts({
    Abel: require('../assets/fonts/Abel-Regular.ttf'),
  });

  const [isReady, setIsReady] = React.useState(false);
  const [initialState, setInitialState] = React.useState<
    InitialState | undefined
  >();

  const [isDarkMode, setIsDarkMode] = React.useState(false);
  const [themeVersion, setThemeVersion] = React.useState<2 | 3>(3);
  const [collapsed, setCollapsed] = React.useState(false);
  const [customFontLoaded, setCustomFont] = React.useState(false);
  const [rippleEffectEnabled, setRippleEffectEnabled] = React.useState(true);

  const theme = React.useMemo(() => {
    if (themeVersion === 2) {
      return isDarkMode ? MD2DarkTheme : MD2LightTheme;
    }

    return isDarkMode ? MD3DarkTheme : MD3LightTheme;
  }, [isDarkMode, themeVersion]);

  React.useEffect(() => {
    const restoreState = async () => {
      try {
        const savedStateString = await AsyncStorage.getItem(PERSISTENCE_KEY);
        const state = JSON.parse(savedStateString || '');

        setInitialState(state);
      } catch (e) {
        // ignore error
      } finally {
        setIsReady(true);
      }
    };

    if (!isReady) {
      restoreState();
    }
  }, [isReady]);

  React.useEffect(() => {
    const restorePrefs = async () => {
      try {
        const prefString = await AsyncStorage.getItem(PREFERENCES_KEY);
        const preferences = JSON.parse(prefString || '');

        if (preferences) {
          setIsDarkMode(preferences.theme === 'dark');
        }
      } catch (e) {
        // ignore error
      }
    };

    restorePrefs();
  }, []);

  React.useEffect(() => {
    const savePrefs = async () => {
      try {
        await AsyncStorage.setItem(
          PREFERENCES_KEY,
          JSON.stringify({
            theme: isDarkMode ? 'dark' : 'light',
          })
        );
      } catch (e) {
        // ignore error
      }
    };

    savePrefs();
  }, [isDarkMode]);

  const preferences = React.useMemo(
    () => ({
      toggleTheme: () => setIsDarkMode((oldValue) => !oldValue),
      toggleCollapsed: () => setCollapsed(!collapsed),
      toggleCustomFont: () => setCustomFont(!customFontLoaded),
      toggleRippleEffect: () => setRippleEffectEnabled(!rippleEffectEnabled),
      toggleThemeVersion: () => {
        setCustomFont(false);
        setCollapsed(false);
        setThemeVersion((oldThemeVersion) => (oldThemeVersion === 2 ? 3 : 2));
        setRippleEffectEnabled(true);
      },
      customFontLoaded,
      rippleEffectEnabled,
      collapsed,
      theme,
    }),
    [theme, collapsed, customFontLoaded, rippleEffectEnabled]
  );

  if (!isReady && !fontsLoaded) {
    return null;
  }

  const { LightTheme, DarkTheme } = adaptNavigationTheme({
    reactNavigationLight: NavigationDefaultTheme,
    reactNavigationDark: NavigationDarkTheme,
  });

  const CombinedDefaultTheme = {
    ...MD3LightTheme,
    ...LightTheme,
    colors: {
      ...MD3LightTheme.colors,
      ...LightTheme.colors,
    },
  };

  const CombinedDarkTheme = {
    ...MD3DarkTheme,
    ...DarkTheme,
    colors: {
      ...MD3DarkTheme.colors,
      ...DarkTheme.colors,
    },
  };

  const combinedTheme = isDarkMode ? CombinedDarkTheme : CombinedDefaultTheme;
  const configuredFontTheme = {
    ...combinedTheme,
    fonts: configureFonts({
      config: {
        fontFamily: 'Abel',
      },
    }),
  };

  //@mayra
  const TeresaDark = {
    ...MD3DarkTheme,
    colors: {
      ...MD3DarkTheme.colors,

      primary: "rgba(0, 200, 179, 1)",
      onPrimary: "rgba(255, 255, 255, 1)",
      primaryContainer: "rgba(215, 247, 229, 1)",
      onPrimaryContainer: "rgba(0, 32, 28, 1)",

      secondary: "rgba(85, 85, 85, 1)",
      onSecondary: "rgba(255, 255, 255, 1)",
      secondaryContainer: "rgba(216, 245, 245, 1)",
      onSecondaryContainer: "rgba(0, 31, 36, 1)",

      tertiary: "rgba(0, 106, 101, 1)",
      onTertiary: "rgba(255, 255, 255, 1)",
      tertiaryContainer: "rgba(255, 255, 255, 1)",
      onTertiaryContainer: "rgba(0, 32, 30, 1)",

      error: "rgba(186, 26, 26, 1)",
      onError: "rgba(255, 255, 255, 1)",
      errorContainer: "rgba(255, 218, 218, 1)",
      onErrorContainer: "rgba(65, 0, 2, 1)",
    },
  }


  //@mayra
  const TeresaTheme = {
    ...MD3LightTheme,
    // ...NavThemes.LightTheme,

    customLineHight: 20,

    roundness: 1,
    // fonts: configureFonts({ config: fontConfig }),

    colors: {
      ...MD3LightTheme.colors,
      // ...NavThemes.LightTheme.colors,

      /**
       * The primary key color is used to derive roles for key components across the UI,
       * such as the FAB, prominent buttons, active states, as well as the tint of elevated surfaces.
       */
      primary: "rgba(0, 200, 179, 1)",
      onPrimary: "rgba(255, 255, 255, 1)",
      primaryContainer: "rgba(186, 26, 26, 1)",
      onPrimaryContainer: "rgba(0, 32, 28, 1)",

      /**
       * The secondary key color is used for less prominent components in the UI such as filter chips,
       * while expanding the opportunity for color expression.
       */
      secondary: "rgba(85, 85, 85, 1)",
      onSecondary: "rgba(255, 255, 255, 1)",
      secondaryContainer: "rgba(216, 245, 245, 1)",
      onSecondaryContainer: "rgba(0, 31, 36, 1)",

      /**
       * The tertiary color role is left for teams to use at their
       * discretion and is intended to support broader color expression in products.
       */
      tertiary: "rgba(0, 106, 101, 1)",
      onTertiary: "rgba(255, 255, 255, 1)",
      tertiaryContainer: "rgba(255, 255, 255, 1)",
      onTertiaryContainer: "rgba(0, 32, 30, 1)",

      /**
       * In addition to the accent and neutral key color,
       * the color system includes a semantic color role for error
       */
      error: "rgba(186, 26, 26, 1)",
      onError: "rgba(255, 255, 255, 1)",
      errorContainer: "rgba(255, 218, 218, 1)",
      onErrorContainer: "rgba(65, 0, 2, 1)",

      /**
       * The neutral key color is used to derive the roles of surface and background,
       * as well as high emphasis text and icons.
       */
      background: "rgba(250, 253, 251, 1)",
      onBackground: "rgba(25, 28, 27, 1)",
      surface: "rgba(250, 253, 251, 1)",
      onSurface: "rgba(25, 28, 27, 1)",

      /**
       * The neutral variant key color is used to derive medium emphasis
       * text and icons, surface variants, and component outlines.
       */
      surfaceVariant: "rgba(0, 0, 0, 0)",
      onSurfaceVariant: "rgba(63, 73, 70, 1)",
      outline: "rgba(125, 221, 221, 1)",
      outlineVariant: "rgba(190, 201, 197, 1)",

      /**
       * These additional role mappings exist in a scheme and are mapped to components where needed.
       */
      shadow: "rgba(0, 0, 0, 1)",
      scrim: "rgba(0, 0, 0, 1)",
      inverseSurface: "rgba(45, 49, 48, 1)",
      inverseOnSurface: "rgba(239, 241, 239, 1)",
      inversePrimary: "rgba(57, 221, 199, 1)",
      backdrop: "rgba(41, 50, 48, 0.4)",

      /**
       * Surfaces at elevation levels 0-5 are tinted via color overlays based on the primary color,
       * such as app bars or menus. The addition of a grade from 0-5 introduces
       * tonal variation to the surface baseline.
       */
      elevation: {
        level0: "transparent",
        level1: "rgba(255, 255, 255, 1)",
        level2: "rgba(245, 253, 249, 1)",
        level3: "rgba(255, 255, 255, 1)",
        level4: "rgba(220, 236, 232, 1)",
        level5: "rgba(215, 233, 229, 1)"
      },

      /**
       * Colors for disabled state
       */
      surfaceDisabled: "rgba(191, 193, 193, 0.12)",
      onSurfaceDisabled: "rgba(191, 193, 193, 0.38)",
    },
  }

  return (
    <PaperProvider
      settings={{ rippleEffectEnabled: preferences.rippleEffectEnabled }}
      theme={TeresaTheme}
    >
      <PreferencesContext.Provider value={preferences}>
        <React.Fragment>
          <NavigationContainer
            theme={combinedTheme}
            initialState={initialState}
            onStateChange={(state) =>
              AsyncStorage.setItem(PERSISTENCE_KEY, JSON.stringify(state))
            }
          >
            <SafeAreaInsetsContext.Consumer>
              {(insets) => {
                const { left, right } = insets || { left: 0, right: 0 };
                const collapsedDrawerWidth = 80 + Math.max(left, right);
                return (
                  <Drawer.Navigator
                    screenOptions={{
                      drawerStyle: collapsed && {
                        width: collapsedDrawerWidth,
                      },
                    }}
                    drawerContent={() => <DrawerItems />}
                  >
                    <Drawer.Screen
                      name="Home"
                      component={App}
                      options={{ headerShown: false }}
                    />
                  </Drawer.Navigator>
                );
              }}
            </SafeAreaInsetsContext.Consumer>
          </NavigationContainer>
        </React.Fragment>
      </PreferencesContext.Provider>
    </PaperProvider>
  );
}
