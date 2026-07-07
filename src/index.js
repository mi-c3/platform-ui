import React from 'react';
import ReactDropzone from 'react-dropzone';

export { useDropzone, ErrorCode } from 'react-dropzone';

import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';

import {
    GridLegacy as Grid,
    Accordion,
    AccordionActions,
    AccordionDetails,
    AccordionSummary,
    AppBar,
    Backdrop,
    Badge,
    BottomNavigation,
    BottomNavigationAction,
    Box,
    Breadcrumbs,
    ButtonBase,
    ButtonGroup,
    Card,
    CardActionArea,
    CardActions,
    CardContent,
    CardHeader,
    CardMedia,
    Chip,
    ClickAwayListener,
    Collapse,
    Container,
    CssBaseline,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Divider,
    Drawer,
    Fab,
    Fade,
    FilledInput,
    FormControl,
    FormControlLabel,
    FormGroup,
    FormHelperText,
    FormLabel,
    Grow,
    Icon,
    IconButton,
    ImageList,
    ImageListItem,
    ImageListItemBar,
    Input,
    InputAdornment,
    InputBase,
    InputLabel,
    LinearProgress,
    List,
    ListItem,
    ListItemAvatar,
    ListItemIcon,
    ListItemSecondaryAction,
    ListItemText,
    ListSubheader,
    Menu,
    MenuItem,
    MenuList,
    MobileStepper,
    Modal,
    NativeSelect,
    NoSsr,
    OutlinedInput,
    Paper,
    Popover,
    Popper,
    Portal,
    RadioGroup,
    Select,
    Slide,
    Snackbar,
    SnackbarContent,
    Step,
    StepButton,
    StepConnector,
    StepContent,
    StepIcon,
    StepLabel,
    Stepper,
    SvgIcon,
    SwipeableDrawer,
    Tab,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableFooter,
    TableHead,
    TablePagination,
    TableRow,
    TableSortLabel,
    Tabs,
    Toolbar,
    Tooltip,
    Typography,
    useMediaQuery,
    useScrollTrigger,
    Zoom,
} from '@mui/material';

import { markdown } from 'utils/utils';
import { DarkTheme, colors } from './styles/theme';
import Avatar from './components/Avatar';
import AvatarEditor from './components/AvatarEditor';
import Autocomplete from './components/Autocomplete';
import AutocompleteLazy from './components/AutocompleteLazy';
import Button from './components/Button';
import CircularProgress from './components/CircularProgress';
import CircularProgressStatic from './components/CircularProgressStatic';
import Checkbox from './components/Checkbox';
import ColorPicker from './components/ColorPicker';
import MdiIcon from './components/MdiIcon';
import Radio from './components/Radio';
import Switch from './components/Switch';
import TextField from './components/TextField';
import MdiIconSelect from './components/MdiIconSelect';
import DataTable from './components/Table/DataTable';
import Link from './components/Link';
import DateTimePickerRange from './components/DateTimePickerRange';
import DateTimePickerRangeModal from './components/DateTimePickerRangeModal';
import DateTimePicker from './components/DateTimePicker';
import DatePicker from './components/DatePicker';
import TimePicker from './components/TimePicker';
import Dropzone from './components/Upload/Dropzone';
import DropzoneDialog from './components/Upload/DropzoneDialog';
import Location from './components/Location/Location';
import LocationForm from './components/Location/LocationForm';
import LocationSwitch from './components/Location/LocationSwitch';
import Slider from './components/Slider';
import UploadFileField from './components/UploadFileField';
import UploadFiles from './components/UploadFiles';
import TextEditor from './components/TextEditor';
import ConfirmationModal from './components/ConfirmationModal';

/**
 * Backward-compatible replacement for @material-ui/pickers' provider.
 * The v3 `utils` prop is ignored — the adapter is always moment.
 */
// eslint-disable-next-line no-unused-vars
const MuiPickersUtilsProvider = ({ utils, children, ...props }) => (
    <LocalizationProvider dateAdapter={AdapterMoment} {...props}>
        {children}
    </LocalizationProvider>
);

export {
    // utils
    markdown,
    colors,
    // Providers
    ThemeProvider,
    StyledEngineProvider,
    LocalizationProvider,
    MuiPickersUtilsProvider,
    // Platform overrides Material UI components
    Autocomplete,
    AutocompleteLazy,
    Avatar,
    Button,
    Checkbox,
    CircularProgress,
    CircularProgressStatic,
    DataTable,
    Link,
    MdiIcon,
    MdiIconSelect,
    Radio,
    Switch,
    TextField,
    UploadFileField,
    UploadFiles,
    // 3dd library
    AvatarEditor,
    ColorPicker,
    DatePicker,
    DateTimePicker,
    DateTimePickerRange,
    DateTimePickerRangeModal,
    Dropzone,
    DropzoneDialog,
    Location,
    LocationForm,
    LocationSwitch,
    ReactDropzone,
    Slider,
    TimePicker,
    TextEditor,
    // Styles
    DarkTheme,
    // Core Components
    Accordion,
    AccordionActions,
    AccordionDetails,
    AccordionSummary,
    AppBar,
    Backdrop,
    Badge,
    BottomNavigation,
    BottomNavigationAction,
    Box,
    Breadcrumbs,
    ButtonBase,
    ButtonGroup,
    Card,
    CardActionArea,
    CardActions,
    CardContent,
    CardHeader,
    CardMedia,
    Chip,
    ClickAwayListener,
    Collapse,
    Container,
    CssBaseline,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Divider,
    Drawer,
    // v4 compat aliases (renamed in MUI v5)
    Accordion as ExpansionPanel,
    AccordionActions as ExpansionPanelActions,
    AccordionDetails as ExpansionPanelDetails,
    AccordionSummary as ExpansionPanelSummary,
    ImageList as GridList,
    ImageListItem as GridListTile,
    ImageListItemBar as GridListTileBar,
    // MUI v7 renamed the legacy grid; consumers keep the old `Grid` API
    Grid,
    Fab,
    Fade,
    FilledInput,
    FormControl,
    FormControlLabel,
    FormGroup,
    FormHelperText,
    FormLabel,
    Grow,
    Icon,
    IconButton,
    ImageList,
    ImageListItem,
    ImageListItemBar,
    Input,
    InputAdornment,
    InputBase,
    InputLabel,
    LinearProgress,
    List,
    ListItem,
    ListItemAvatar,
    ListItemIcon,
    ListItemSecondaryAction,
    ListItemText,
    ListSubheader,
    Menu,
    MenuItem,
    MenuList,
    MobileStepper,
    Modal,
    NativeSelect,
    NoSsr,
    OutlinedInput,
    Paper,
    Popover,
    Popper,
    Portal,
    RadioGroup,
    Select,
    Slide,
    Snackbar,
    SnackbarContent,
    Step,
    StepButton,
    StepConnector,
    StepContent,
    StepIcon,
    StepLabel,
    Stepper,
    SvgIcon,
    SwipeableDrawer,
    Tab,
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TablePagination,
    TableRow,
    TableSortLabel,
    TableContainer,
    Tabs,
    Toolbar,
    Tooltip,
    Typography,
    useMediaQuery,
    useScrollTrigger,
    Zoom,
    ConfirmationModal,
};
