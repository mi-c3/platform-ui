import ReactDropzone from 'react-dropzone';

import { createGenerateClassName, ThemeProvider } from '@material-ui/core/styles';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';

import { AppBar, Backdrop } from '@material-ui/core';
import Badge from '@material-ui/core/Badge';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import ButtonBase from '@material-ui/core/ButtonBase';
import Box from '@material-ui/core/Box';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import Chip from '@material-ui/core/Chip';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Container from '@material-ui/core/Container';
import Collapse from '@material-ui/core/Collapse';
import CssBaseline from '@material-ui/core/CssBaseline';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelActions from '@material-ui/core/ExpansionPanelActions';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Fab from '@material-ui/core/Fab';
import Fade from '@material-ui/core/Fade';
import FilledInput from '@material-ui/core/FilledInput';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormLabel from '@material-ui/core/FormLabel';
import Grid from '@material-ui/core/Grid';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import Grow from '@material-ui/core/Grow';
import Hidden from '@material-ui/core/Hidden';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import InputBase from '@material-ui/core/InputBase';
import InputLabel from '@material-ui/core/InputLabel';
import LinearProgress from '@material-ui/core/LinearProgress';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import Modal from '@material-ui/core/Modal';
import MobileStepper from '@material-ui/core/MobileStepper';
import NativeSelect from '@material-ui/core/NativeSelect';
import NoSsr from '@material-ui/core/NoSsr';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import Paper from '@material-ui/core/Paper';
import Popover from '@material-ui/core/Popover';
import Popper from '@material-ui/core/Popper';
import Portal from '@material-ui/core/Portal';
import RadioGroup from '@material-ui/core/RadioGroup';
import RootRef from '@material-ui/core/RootRef';
import Select from '@material-ui/core/Select';
import Slide from '@material-ui/core/Slide';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import Step from '@material-ui/core/Step';
import StepButton from '@material-ui/core/StepButton';
import StepConnector from '@material-ui/core/StepConnector';
import StepContent from '@material-ui/core/StepContent';
import StepIcon from '@material-ui/core/StepIcon';
import StepLabel from '@material-ui/core/StepLabel';
import Stepper from '@material-ui/core/Stepper';
import SvgIcon from '@material-ui/core/SvgIcon';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import Tab from '@material-ui/core/Tab';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableFooter from '@material-ui/core/TableFooter';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import TableContainer from '@material-ui/core/TableContainer';
import Tabs from '@material-ui/core/Tabs';
import Toolbar from '@material-ui/core/Toolbar';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import useScrollTrigger from '@material-ui/core/useScrollTrigger';
import withWidth from '@material-ui/core/withWidth';
import Zoom from '@material-ui/core/Zoom';

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

export {
    // utils
    markdown,
    colors,
    createGenerateClassName,
    // Providers
    ThemeProvider,
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
    ExpansionPanel,
    ExpansionPanelActions,
    ExpansionPanelDetails,
    ExpansionPanelSummary,
    Fab,
    Fade,
    FilledInput,
    FormControl,
    FormControlLabel,
    FormGroup,
    FormHelperText,
    FormLabel,
    Grid,
    GridList,
    GridListTile,
    GridListTileBar,
    Grow,
    Hidden,
    Icon,
    IconButton,
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
    RootRef,
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
    withMobileDialog,
    withWidth,
    Zoom,
    ConfirmationModal,
};
