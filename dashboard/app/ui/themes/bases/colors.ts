import { theme, useColorModeValue } from '@chakra-ui/react';

export const colors = {
  primary: {
    200: '#126631',
    300: '#22C55E',
    400: '#D9FBE6',
    500: '#0C642F',
    600: '#16A34A',
    800: '#27DA68',
    700: '#2A313C',
    750: '#1B1D21',
    900: '#B7FFD1',
    1000: '#ff0000',
  },

  secondary: {
    100: '#F6FAFF',
    150: '#FAFAFA',
    200: '#F7FAFC',
    250: '#4B5772',
    300: '#969BA0',
    350: '#6B7280',
    400: '#1D1E24',
    450: '#4F5669',
    500: '#2D3748',
    550: '#23302B',
    600: '#23262B',
    650: '#1D0024',
    700: '#747681',
    750: '#2A313C',
    800: '#EDF2F7',
    850: '#E2E8F0',
    900: '#2563EB',
    950: '#4A5568',
    1000: '#E5E7EB',
    1050: '#9AA2B1',
    1100: '#718096',
  },

  gray: {
    650: '#5F6364',
  },

  common: {
    white: '#FFF',
  },

  background: {
    body: {
      primary: {
        default: '#FAFAFA',
        _dark: '#23262B',
      },
      secondary: {
        default: '#FFF',
        _dark: '#23262B',
      },
      tertiary: {
        default: '#FAFAFA',
        _dark: '#151515',
      },
      quaternary: {
        default: '#FFF',
        _dark: '#1D1E24',
      },
      quinary: {
        default: 'primary.400',
        _dark: '#23262B',
      },
      senary: {
        default: '#F7FAFC',
        _dark: '#1D1E24',
      },
      septenary: {
        default: '#FFF',
        _dark: '#1D1E24',
      },

      octonary: {
        default: '#1B1D21',
        _dark: '#FFF',
      },
    },
    section: {
      primary: {
        default: '#F6FAFF',
        _dark: '#1D1E24',
      },

      messageUser: {
        default: '#EDf2f7',
        _dark: '#1D1E24',
      },
    },

    component: {
      primary: {
        default: '#FFF',
        _dark: '#1D1E24',
      },
      secondary: {
        default: '#F7FAFC',
        _dark: '#23262B',
      },
      tertiary: {
        default: 'gray.50',
        _dark: 'gray.700',
      },
      quaternary: {
        default: '#4F5669',
        _dark: '#23262B',
      },
      select: {
        primary: {
          default: '#F7FAFC',
          _dark: '#23262B',
        },
        secondary: {
          default: '#FFF',
          _dark: '#1D1E25',
        },
        noBackground: {
          default: '#FFF',
          _dark: '#1D1E25',
        },
      },
      selectList: {
        default: '#FFF',
        _dark: '#23262B',
      },
      tagPrimary: {
        default: 'primary.400',
        _dark: '#23262B',
      },
      tagSecondary: {
        default: 'warning.300',
        _dark: '#23262B',
      },
      table: {
        primary: {
          default: '#FFF',
          _dark: '#1D1E24',
        },
      },
    },
  },

  border: {
    primary: {
      default: '#E2E8F0',
      _dark: '#2A313C',
    },
    secondary: {
      default: '#F7F7F7',
      _dark: '#2A313C',
    },
    tertiary: {
      default: '#E2E8F0',
      _dark: '#2A313C',
    },
    quaternary: {
      default: '#E2E8F0',
      _dark: '#2A313C',
    },

    quinary: {
      default: '#EDf2F7',
      _dark: '#2A313C',
    },
    senary: {
      default: '#E5E7EB',
      _dark: '#2A313C',
    },

    septenary: {
      default: 'gray.200',
      _dark: 'gray.700',
    },

    octonary: {
      default: 'primary.700',
      _dark: 'gray.400',
    },

    nonary: {
      default: 'gray.300',
      _dark: 'secondary.450',
    },

    denary: {
      default: 'secondary.150',
      _dark: '#23262B',
    },

    divider: {
      default: 'secondary.450',
      _dark: '#AEB2C1',
    },
  },

  text: {
    primary: {
      default: '#1A202C',
      _dark: '#FFF',
    },
    secondary: {
      default: '#4F5669',
      _dark: '#FAFAFA',
    },

    tertiary: {
      default: '#4B5772',
      _dark: '#747681',
    },
    quaternary: {
      default: '#22C55E',
      _dark: '#FAFAFA',
    },
    textInfo: {
      default: '#4A5568',
      _dark: '#FAFAFA',
    },
    quinary: {
      default: '#1A202C',
      _dark: '#FFF',
    },
    senary: {
      default: '#4A5568',
      _dark: '#AEB2C1',
    },
    septenary: {
      default: '#1A202C',
      _dark: '#747681',
    },
    octonary: {
      default: '#4A5568',
      _dark: '#FFF',
    },
    nonary: {
      default: '#4B5772',
      _dark: '#FFF',
    },
    denary: {
      default: '#6B7280',
      _dark: '#FFF',
    },

    textTime: {
      default: '#4B5772',
      _dark: '#A0AEC0',
    },
    currencyColor: {
      default: '#0C642F',
      _dark: '#22C55E',
    },

    ternary: {
      default: '#525962',
      _dark: '#FAFAFA',
    },

    binary: {
      default: '#525962',
      _dark: '#FFF',
    },

    textTitle: {
      default: '#2D3748',
      _dark: '#FAFAFA',
    },

    textNote: {
      default: '#2D3748',
      _dark: '#FFF',
    },

    textIssues: {
      default: '#51586C',
      _dark: '#FFF',
    },

    textLoadMore: {
      default: '#FFF',
      _dark: '#1A202C',
    },

    textInput: {
      default: '#FAFAFA',
      _dark: '#FFF',
    },
    textDarkCheckbox: {
      default: '#0C642F',
      _dark: '#FAFAFA',
    },
  },

  icon: {
    closeIcon: '#A0AEC0',
  },

  danger: {
    300: '#E53E3E',
    400: '#FF4747',
    500: '#9B1717',
  },

  warning: {
    300: '#FFFBEB',
    400: '#FDF9E9',
    500: '#EAB308',
    600: '#FDF9E9',
    700: '#FF784B',
    800: '#784B08',
  },
};

export const useColorfill = () => {
  const primary = useColorModeValue(theme.colors.gray[800], theme.colors.white);

  const secondary = useColorModeValue(
    colors.secondary[200],
    colors.secondary[600],
  );

  const tertiary = useColorModeValue(
    theme.colors.gray[400],
    theme.colors.white,
  );

  const quaternary = useColorModeValue('secondary.200', 'secondary.600');

  const quinary = useColorModeValue(theme.colors.white, colors.secondary[400]);

  const senary: string = useColorModeValue(
    colors.secondary[400] ?? '',
    colors.primary[500] ?? '',
  );

  const septenary = useColorModeValue('gray.650', 'common.white');

  return {
    primary,
    secondary,
    tertiary,
    quaternary,
    quinary,
    senary,
    septenary,
  };
};
