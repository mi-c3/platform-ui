const reactLib = require('./reactLib.middleware');

module.exports = ({ rootDir }) =>
    reactLib({
        rootDir,
        externals: {
            '@material-ui/core': 'commonjs2 @material-ui/core',
            '@material-ui/core/Avatar': 'commonjs2 @material-ui/core/Avatar',
            '@material-ui/core/Badge': 'commonjs2 @material-ui/core/Badge',
            '@material-ui/core/BottomNavigation': 'commonjs2 @material-ui/core/BottomNavigation',
            '@material-ui/core/BottomNavigationAction': 'commonjs2 @material-ui/core/BottomNavigationAction',
            '@material-ui/core/Box': 'commonjs2 @material-ui/core/Box',
            '@material-ui/core/Breadcrumbs': 'commonjs2 @material-ui/core/Breadcrumbs',
            '@material-ui/core/Button': 'commonjs2 @material-ui/core/Button',
            '@material-ui/core/ButtonBase': 'commonjs2 @material-ui/core/ButtonBase',
            '@material-ui/core/ButtonGroup': 'commonjs2 @material-ui/core/ButtonGroup',
            '@material-ui/core/Card': 'commonjs2 @material-ui/core/Card',
            '@material-ui/core/CardActionArea': 'commonjs2 @material-ui/core/CardActionArea',
            '@material-ui/core/CardActions': 'commonjs2 @material-ui/core/CardActions',
            '@material-ui/core/CardContent': 'commonjs2 @material-ui/core/CardContent',
            '@material-ui/core/CardHeader': 'commonjs2 @material-ui/core/CardHeader',
            '@material-ui/core/CardMedia': 'commonjs2 @material-ui/core/CardMedia',
            '@material-ui/core/Checkbox': 'commonjs2 @material-ui/core/Checkbox',
            '@material-ui/core/Chip': 'commonjs2 @material-ui/core/Chip',
            '@material-ui/core/CircularProgress': 'commonjs2 @material-ui/core/CircularProgress',
            '@material-ui/core/ClickAwayListener': 'commonjs2 @material-ui/core/ClickAwayListener',
            '@material-ui/core/Collapse': 'commonjs2 @material-ui/core/Collapse',
            '@material-ui/core/colors/amber': 'commonjs2 @material-ui/core/colors/amber',
            '@material-ui/core/colors/green': 'commonjs2 @material-ui/core/colors/green',
            '@material-ui/core/Container': 'commonjs2 @material-ui/core/Container',
            '@material-ui/core/CssBaseline': 'commonjs2 @material-ui/core/CssBaseline',
            '@material-ui/core/Dialog': 'commonjs2 @material-ui/core/Dialog',
            '@material-ui/core/DialogActions': 'commonjs2 @material-ui/core/DialogActions',
            '@material-ui/core/DialogContent': 'commonjs2 @material-ui/core/DialogContent',
            '@material-ui/core/DialogContentText': 'commonjs2 @material-ui/core/DialogContentText',
            '@material-ui/core/DialogTitle': 'commonjs2 @material-ui/core/DialogTitle',
            '@material-ui/core/Divider': 'commonjs2 @material-ui/core/Divider',
            '@material-ui/core/Drawer': 'commonjs2 @material-ui/core/Drawer',
            '@material-ui/core/ExpansionPanel': 'commonjs2 @material-ui/core/ExpansionPanel',
            '@material-ui/core/ExpansionPanelActions': 'commonjs2 @material-ui/core/ExpansionPanelActions',
            '@material-ui/core/ExpansionPanelDetails': 'commonjs2 @material-ui/core/ExpansionPanelDetails',
            '@material-ui/core/ExpansionPanelSummary': 'commonjs2 @material-ui/core/ExpansionPanelSummary',
            '@material-ui/core/Fab': 'commonjs2 @material-ui/core/Fab',
            '@material-ui/core/Fade': 'commonjs2 @material-ui/core/Fade',
            '@material-ui/core/FilledInput': 'commonjs2 @material-ui/core/FilledInput',
            '@material-ui/core/FormControl': 'commonjs2 @material-ui/core/FormControl',
            '@material-ui/core/FormControlLabel': 'commonjs2 @material-ui/core/FormControlLabel',
            '@material-ui/core/FormGroup': 'commonjs2 @material-ui/core/FormGroup',
            '@material-ui/core/FormHelperText': 'commonjs2 @material-ui/core/FormHelperText',
            '@material-ui/core/FormLabel': 'commonjs2 @material-ui/core/FormLabel',
            '@material-ui/core/Grid': 'commonjs2 @material-ui/core/Grid',
            '@material-ui/core/GridList': 'commonjs2 @material-ui/core/GridList',
            '@material-ui/core/GridListTile': 'commonjs2 @material-ui/core/GridListTile',
            '@material-ui/core/GridListTileBar': 'commonjs2 @material-ui/core/GridListTileBar',
            '@material-ui/core/Grow': 'commonjs2 @material-ui/core/Grow',
            '@material-ui/core/Hidden': 'commonjs2 @material-ui/core/Hidden',
            '@material-ui/core/Icon': 'commonjs2 @material-ui/core/Icon',
            '@material-ui/core/IconButton': 'commonjs2 @material-ui/core/IconButton',
            '@material-ui/core/Input': 'commonjs2 @material-ui/core/Input',
            '@material-ui/core/InputAdornment': 'commonjs2 @material-ui/core/InputAdornment',
            '@material-ui/core/InputBase': 'commonjs2 @material-ui/core/InputBase',
            '@material-ui/core/InputLabel': 'commonjs2 @material-ui/core/InputLabel',
            '@material-ui/core/LinearProgress': 'commonjs2 @material-ui/core/LinearProgress',
            '@material-ui/core/Link': 'commonjs2 @material-ui/core/Link',
            '@material-ui/core/List': 'commonjs2 @material-ui/core/List',
            '@material-ui/core/ListItem': 'commonjs2 @material-ui/core/ListItem',
            '@material-ui/core/ListItemAvatar': 'commonjs2 @material-ui/core/ListItemAvatar',
            '@material-ui/core/ListItemIcon': 'commonjs2 @material-ui/core/ListItemIcon',
            '@material-ui/core/ListItemSecondaryAction': 'commonjs2 @material-ui/core/ListItemSecondaryAction',
            '@material-ui/core/ListItemText': 'commonjs2 @material-ui/core/ListItemText',
            '@material-ui/core/ListSubheader': 'commonjs2 @material-ui/core/ListSubheader',
            '@material-ui/core/Menu': 'commonjs2 @material-ui/core/Menu',
            '@material-ui/core/MenuItem': 'commonjs2 @material-ui/core/MenuItem',
            '@material-ui/core/MenuList': 'commonjs2 @material-ui/core/MenuList',
            '@material-ui/core/MobileStepper': 'commonjs2 @material-ui/core/MobileStepper',
            '@material-ui/core/Modal': 'commonjs2 @material-ui/core/Modal',
            '@material-ui/core/NativeSelect': 'commonjs2 @material-ui/core/NativeSelect',
            '@material-ui/core/NoSsr': 'commonjs2 @material-ui/core/NoSsr',
            '@material-ui/core/OutlinedInput': 'commonjs2 @material-ui/core/OutlinedInput',
            '@material-ui/core/Paper': 'commonjs2 @material-ui/core/Paper',
            '@material-ui/core/Popover': 'commonjs2 @material-ui/core/Popover',
            '@material-ui/core/Popper': 'commonjs2 @material-ui/core/Popper',
            '@material-ui/core/Portal': 'commonjs2 @material-ui/core/Portal',
            '@material-ui/core/Radio': 'commonjs2 @material-ui/core/Radio',
            '@material-ui/core/RadioGroup': 'commonjs2 @material-ui/core/RadioGroup',
            '@material-ui/core/RootRef': 'commonjs2 @material-ui/core/RootRef',
            '@material-ui/core/Select': 'commonjs2 @material-ui/core/Select',
            '@material-ui/core/Slide': 'commonjs2 @material-ui/core/Slide',
            '@material-ui/core/Slider': 'commonjs2 @material-ui/core/Slider',
            '@material-ui/core/Snackbar': 'commonjs2 @material-ui/core/Snackbar',
            '@material-ui/core/SnackbarContent': 'commonjs2 @material-ui/core/SnackbarContent',
            '@material-ui/core/Step': 'commonjs2 @material-ui/core/Step',
            '@material-ui/core/StepButton': 'commonjs2 @material-ui/core/StepButton',
            '@material-ui/core/StepConnector': 'commonjs2 @material-ui/core/StepConnector',
            '@material-ui/core/StepContent': 'commonjs2 @material-ui/core/StepContent',
            '@material-ui/core/StepIcon': 'commonjs2 @material-ui/core/StepIcon',
            '@material-ui/core/StepLabel': 'commonjs2 @material-ui/core/StepLabel',
            '@material-ui/core/Stepper': 'commonjs2 @material-ui/core/Stepper',
            '@material-ui/core/styles': 'commonjs2 @material-ui/core/styles',
            '@material-ui/core/styles/colorManipulator': 'commonjs2 @material-ui/core/styles/colorManipulator',
            '@material-ui/core/SvgIcon': 'commonjs2 @material-ui/core/SvgIcon',
            '@material-ui/core/SwipeableDrawer': 'commonjs2 @material-ui/core/SwipeableDrawer',
            '@material-ui/core/Switch': 'commonjs2 @material-ui/core/Switch',
            '@material-ui/core/Tab': 'commonjs2 @material-ui/core/Tab',
            '@material-ui/core/Table': 'commonjs2 @material-ui/core/Table',
            '@material-ui/core/TableBody': 'commonjs2 @material-ui/core/TableBody',
            '@material-ui/core/TableCell': 'commonjs2 @material-ui/core/TableCell',
            '@material-ui/core/TableFooter': 'commonjs2 @material-ui/core/TableFooter',
            '@material-ui/core/TableHead': 'commonjs2 @material-ui/core/TableHead',
            '@material-ui/core/TablePagination': 'commonjs2 @material-ui/core/TablePagination',
            '@material-ui/core/TableRow': 'commonjs2 @material-ui/core/TableRow',
            '@material-ui/core/TableSortLabel': 'commonjs2 @material-ui/core/TableSortLabel',
            '@material-ui/core/Tabs': 'commonjs2 @material-ui/core/Tabs',
            '@material-ui/core/Toolbar': 'commonjs2 @material-ui/core/Toolbar',
            '@material-ui/core/Tooltip': 'commonjs2 @material-ui/core/Tooltip',
            '@material-ui/core/Typography': 'commonjs2 @material-ui/core/Typography',
            '@material-ui/core/useMediaQuery': 'commonjs2 @material-ui/core/useMediaQuery',
            '@material-ui/core/useScrollTrigger': 'commonjs2 @material-ui/core/useScrollTrigger',
            '@material-ui/core/withMobileDialog': 'commonjs2 @material-ui/core/withMobileDialog',
            '@material-ui/core/withWidth': 'commonjs2 @material-ui/core/withWidth',
            '@material-ui/core/Zoom': 'commonjs2 @material-ui/core/Zoom',
            '@material-ui/icons/AttachFile': 'commonjs2 @material-ui/icons/AttachFile',
            '@material-ui/icons/Cancel': 'commonjs2 @material-ui/icons/Cancel',
            '@material-ui/icons/CheckCircle': 'commonjs2 @material-ui/icons/CheckCircle',
            '@material-ui/icons/Close': 'commonjs2 @material-ui/icons/Close',
            '@material-ui/icons/CloudUpload': 'commonjs2 @material-ui/icons/CloudUpload',
            '@material-ui/icons/Delete': 'commonjs2 @material-ui/icons/Delete',
            '@material-ui/icons/Error': 'commonjs2 @material-ui/icons/Error',
            '@material-ui/icons/FilterList': 'commonjs2 @material-ui/icons/FilterList',
            '@material-ui/icons/Info': 'commonjs2 @material-ui/icons/Info',
            '@material-ui/icons/Warning': 'commonjs2 @material-ui/icons/Warning',
            '@material-ui/pickers': 'commonjs2 @material-ui/pickers',
            '@material-ui/styles': 'commonjs2 @material-ui/styles',
            'fast-deep-equal': 'commonjs2 fast-deep-equal',
            'google-map-react': 'commonjs2 google-map-react',
            marked: 'commonjs2 marked',
            'memoize-one': 'commonjs2 memoize-one',
            moment: 'commonjs2 moment',
            'prop-types': 'commonjs2 prop-types',
            react: 'commonjs2 react',
            'react-avatar-editor': 'commonjs2 react-avatar-editor',
            'react-color': 'commonjs2 react-color',
            'react-dom': 'commonjs2 react-dom',
            'react-dropzone': 'commonjs2 react-dropzone',
            'react-mde': 'commonjs2 react-mde',
            'react-router-dom': 'commonjs2 react-router-dom',
            'react-tiny-virtual-list': 'commonjs2 react-tiny-virtual-list',
            'styled-components': 'commonjs2 styled-components',
        },
    });