// ** React Imports
import TabContext from '@mui/lab/TabContext'
import MuiTabList, { TabListProps } from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import InputAdornment from '@mui/material/InputAdornment'
import { SyntheticEvent, forwardRef, useEffect, useState } from 'react'

// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import FormControl from '@mui/material/FormControl'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import TextField from '@mui/material/TextField'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import { DataGrid, GridColDef, GridRowId } from '@mui/x-data-grid'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Imports
import format from 'date-fns/format'
import DatePicker from 'react-datepicker'

// ** Store & Actions Imports
import { useDispatch, useSelector } from 'react-redux'
import { deleteInvoice, fetchData } from 'src/store/apps/invoice'

// ** Types Imports
import { ThemeColor } from 'src/@core/layouts/types'
import { AppDispatch, RootState } from 'src/store'
import { InvoiceType } from 'src/types/apps/invoiceTypes'
import { DateType } from 'src/types/forms/reactDatepickerTypes'

// ** Utils Import
import { getInitials } from 'src/@core/utils/get-initials'

// ** Custom Components Imports
import CustomAvatar from 'src/@core/components/mui/avatar'
import CustomChip from 'src/@core/components/mui/chip'
import OptionsMenu from 'src/@core/components/option-menu'

// ** Styled Components
import { Chip, Tab } from '@mui/material'
import PageHeader from 'src/@core/components/page-header'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import CardStatisticsCharacters from 'src/views/ui/cards/statistics/CardStatisticsCharacters'

interface InvoiceStatusObj {
  [key: string]: {
    icon: string
    color: ThemeColor
  }
}

interface CustomInputProps {
  dates: Date[]
  label: string
  end: number | Date
  start: number | Date
  setDates?: (value: Date[]) => void
}

interface CellType {
  row: InvoiceType
}

// ** Styled component for the link in the dataTable
const LinkStyled = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  color: theme.palette.primary.main
}))

// ** Vars
const invoiceStatusObj: InvoiceStatusObj = {
  Sent: { color: 'secondary', icon: 'mdi:send' },
  Paid: { color: 'success', icon: 'mdi:check' },
  Draft: { color: 'primary', icon: 'mdi:content-save-outline' },
  'Partial Payment': { color: 'warning', icon: 'mdi:chart-pie' },
  'Past Due': { color: 'error', icon: 'mdi:information-outline' },
  Downloaded: { color: 'info', icon: 'mdi:arrow-down' }
}

// ** renders client column
const renderClient = (row: InvoiceType) => {
  if (row.avatar.length) {
    return <CustomAvatar src={row.avatar} sx={{ mr: 3, width: '1.875rem', height: '1.875rem' }} />
  } else {
    return (
      <CustomAvatar
        skin='light'
        color={(row.avatarColor as ThemeColor) || ('primary' as ThemeColor)}
        sx={{ mr: 3, fontSize: '.8rem', width: '1.875rem', height: '1.875rem' }}
      >
        {getInitials(row.name || 'John Doe')}
      </CustomAvatar>
    )
  }
}

const defaultColumns: GridColDef[] = [
  {
    flex: 0.1,
    field: 'id',
    minWidth: 80,
    headerName: '#',
    renderCell: ({ row }: CellType) => <LinkStyled href={`/invoice/preview/${row.id}`}>{`#${row.id}`}</LinkStyled>
  },
  {
    flex: 0.1,
    minWidth: 80,
    field: 'invoiceStatus',
    renderHeader: () => <Icon icon='mdi:trending-up' fontSize={20} />,
    renderCell: ({ row }: CellType) => {
      const { dueDate, balance, invoiceStatus } = row

      const color = invoiceStatusObj[invoiceStatus] ? invoiceStatusObj[invoiceStatus].color : 'primary'

      return (
        <Tooltip
          title={
            <div>
              <Typography variant='caption' sx={{ color: 'common.white', fontWeight: 600 }}>
                {invoiceStatus}
              </Typography>
              <br />
              <Typography variant='caption' sx={{ color: 'common.white', fontWeight: 600 }}>
                Balance:
              </Typography>{' '}
              {balance}
              <br />
              <Typography variant='caption' sx={{ color: 'common.white', fontWeight: 600 }}>
                Due Date:
              </Typography>{' '}
              {dueDate}
            </div>
          }
        >
          <CustomAvatar skin='light' color={color} sx={{ width: '1.875rem', height: '1.875rem' }}>
            <Icon icon={invoiceStatusObj[invoiceStatus].icon} fontSize='1rem' />
          </CustomAvatar>
        </Tooltip>
      )
    }
  },
  {
    flex: 0.25,
    field: 'name',
    minWidth: 300,
    headerName: 'Client',
    renderCell: ({ row }: CellType) => {
      const { name, companyEmail } = row

      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {renderClient(row)}
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography noWrap variant='body2' sx={{ color: 'text.primary', fontWeight: 600 }}>
              {name}
            </Typography>
            <Typography noWrap variant='caption'>
              {companyEmail}
            </Typography>
          </Box>
        </Box>
      )
    }
  },
  {
    flex: 0.1,
    minWidth: 90,
    field: 'total',
    headerName: 'Total',
    renderCell: ({ row }: CellType) => <Typography variant='body2'>{`$${row.total || 0}`}</Typography>
  },
  {
    flex: 0.15,
    minWidth: 125,
    field: 'issuedDate',
    headerName: 'Issued Date',
    renderCell: ({ row }: CellType) => <Typography variant='body2'>{row.issuedDate}</Typography>
  },
  {
    flex: 0.1,
    minWidth: 90,
    field: 'balance',
    headerName: 'Balance',
    renderCell: ({ row }: CellType) => {
      return row.balance !== 0 ? (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {row.balance}
        </Typography>
      ) : (
        <CustomChip size='small' skin='light' color='success' label='Paid' />
      )
    }
  }
]

/* eslint-disable */
const CustomInput = forwardRef((props: CustomInputProps, ref) => {
  const startDate = props.start !== null ? format(props.start, 'MM/dd/yyyy') : ''
  const endDate = props.end !== null ? ` - ${format(props.end, 'MM/dd/yyyy')}` : null

  const value = `${startDate}${endDate !== null ? endDate : ''}`
  props.start === null && props.dates.length && props.setDates ? props.setDates([]) : null
  const updatedProps = { ...props }
  delete updatedProps.setDates

  return <TextField fullWidth inputRef={ref} {...updatedProps} label={props.label || ''} value={value} />
})
/* eslint-enable */

const TabList = styled(MuiTabList)<TabListProps>(({ theme }) => ({
  '& .MuiTabs-indicator': {
    display: 'none'
  },
  '& .Mui-selected': {
    backgroundColor: theme.palette.primary.main,
    color: `${theme.palette.common.white} !important`
  },
  '& .MuiTab-root': {
    minWidth: 65,
    minHeight: 40,
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    borderRadius: theme.shape.borderRadius,
    [theme.breakpoints.up('md')]: {
      minWidth: 130
    }
  }
}))

const InvoiceList = () => {
  // ** State
  const [dates, setDates] = useState<Date[]>([])
  const [value, setValue] = useState<string>('')
  const [statusValue, setStatusValue] = useState<string>('')
  const [endDateRange, setEndDateRange] = useState<DateType>(null)
  const [, setSelectedRows] = useState<GridRowId[]>([])
  const [startDateRange, setStartDateRange] = useState<DateType>(null)
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10
  })
  const [activeTab, setActiveTab] = useState<string>('overview')

  // ** Hooks
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.invoice)

  useEffect(() => {
    dispatch(
      fetchData({
        dates,
        q: value,
        status: statusValue
      })
    )
  }, [dispatch, statusValue, value, dates])

  const handleFilter = (val: string) => {
    setValue(val)
  }

  const handleStatusValue = (e: SelectChangeEvent) => {
    setStatusValue(e.target.value)
  }

  const handleOnChangeRange = (dates: any) => {
    const [start, end] = dates
    if (start !== null && end !== null) {
      setDates(dates)
    }
    setStartDateRange(start)
    setEndDateRange(end)
  }

  const columns: GridColDef[] = [
    ...defaultColumns,
    {
      flex: 0.1,
      minWidth: 130,
      sortable: false,
      field: 'actions',
      headerName: 'Actions',
      renderCell: ({ row }: CellType) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Tooltip title='Delete Invoice'>
            <IconButton size='small' onClick={() => dispatch(deleteInvoice(row.id))}>
              <Icon icon='mdi:delete-outline' fontSize={20} />
            </IconButton>
          </Tooltip>
          <Tooltip title='View'>
            <IconButton size='small' component={Link} href={`/invoice/preview/${row.id}`}>
              <Icon icon='mdi:eye-outline' fontSize={20} />
            </IconButton>
          </Tooltip>
          <OptionsMenu
            iconProps={{ fontSize: 20 }}
            iconButtonProps={{ size: 'small' }}
            menuProps={{ sx: { '& .MuiMenuItem-root svg': { mr: 2 } } }}
            options={[
              {
                text: 'Download',
                icon: <Icon icon='mdi:download' fontSize={20} />
              },
              {
                text: 'Edit',
                href: `/invoice/edit/${row.id}`,
                icon: <Icon icon='mdi:pencil-outline' fontSize={20} />
              },
              {
                text: 'Duplicate',
                icon: <Icon icon='mdi:content-copy' fontSize={20} />
              }
            ]}
          />
        </Box>
      )
    }
  ]

  const handleChange = (event: SyntheticEvent, value: string) => {
    setActiveTab(value)
  }

  return (
    <DatePickerWrapper>
      <Grid container spacing={2}>
        <Grid item xs={9}>
          <PageHeader
            title={<Typography variant='h5'>Facturas por cobrar</Typography>}
            subtitle={
              <Typography variant='body2' fontWeight={500}>
                Revisa tus facturas y selecciona las que quieres cotizar su adelanto
              </Typography>
            }
          />
        </Grid>
        <Grid item xs={12}>
          <CardStatisticsCharacters
            data={[
              {
                stats: '13.7k',
                title: 'Ratings',
                trendNumber: '+38%',
                src: '/images/cards/pose_f9.png',
                chipText: `Year of ${new Date().getFullYear()}`
              },
              {
                stats: '24.5k',
                trend: 'negative',
                title: 'Sessions',
                trendNumber: '-22%',
                chipText: 'Last Week',
                chipColor: 'secondary',
                src: '/images/cards/pose_m18.png'
              },
              {
                stats: '2,856',
                chipColor: 'info',
                title: 'Customers',
                trendNumber: '+59%',
                chipText: 'Last Quarter',
                src: '/images/cards/pose_m1.png'
              },
              {
                stats: '42.5k',
                trendNumber: '+26%',
                chipColor: 'warning',
                title: 'Total Orders',
                chipText: 'Last Month',
                src: '/images/cards/pose_m35.png'
              }
            ]}
          />
        </Grid>
        <Grid item xs={12}>
          <Card>
            <TabContext value={activeTab}>
              <Box sx={{ m: 4 }}>
                <TabList
                  variant='scrollable'
                  scrollButtons='auto'
                  onChange={handleChange}
                  aria-label='forced scroll tabs example'
                >
                  <Tab
                    value='overview'
                    label={
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center'
                        }}
                      >
                        <Box mr={3}>Financiamiento Directo</Box>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                          <Chip
                            label={4}
                            sx={{
                              background: theme =>
                                `${activeTab === 'overview' ? theme.palette.primary.light : theme.palette.grey[300]}`
                            }}
                          />
                        </Box>
                      </Box>
                    }
                  />
                  <Tab
                    value='security'
                    label={
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center'
                        }}
                      >
                        <Box mr={3}>Pronto Pago</Box>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                          <Chip
                            label={0}
                            sx={{
                              background: theme =>
                                `${activeTab === 'security' ? theme.palette.primary.light : theme.palette.grey[300]}`
                            }}
                          />
                        </Box>
                      </Box>
                    }
                  />
                </TabList>
                <>
                  <Grid container spacing={1} my={3} mt={10} justifyContent={'space-around'}>
                    <Grid item xs={3}>
                      <TextField
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position='start'>
                              <Icon icon='mdi:magnify' />
                            </InputAdornment>
                          )
                        }}
                        value={value}
                        sx={{ mr: 4, mb: 2 }}
                        placeholder='Buscar por cliente, folio o RUT'
                        onChange={e => handleFilter(e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={3}>
                      <FormControl fullWidth>
                        <InputLabel id='invoice-status-select'>Invoice Status</InputLabel>
                        <Select
                          fullWidth
                          value={statusValue}
                          sx={{ mr: 4, mb: 2 }}
                          label='Invoice Status'
                          onChange={handleStatusValue}
                          labelId='invoice-status-select'
                        >
                          <MenuItem value=''>none</MenuItem>
                          <MenuItem value='downloaded'>Downloaded</MenuItem>
                          <MenuItem value='draft'>Draft</MenuItem>
                          <MenuItem value='paid'>Paid</MenuItem>
                          <MenuItem value='partial payment'>Partial Payment</MenuItem>
                          <MenuItem value='past due'>Past Due</MenuItem>
                          <MenuItem value='sent'>Sent</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={4}>
                      <DatePicker
                        isClearable
                        selectsRange
                        monthsShown={2}
                        endDate={endDateRange}
                        selected={startDateRange}
                        startDate={startDateRange}
                        shouldCloseOnSelect={false}
                        id='date-range-picker-months'
                        onChange={handleOnChangeRange}
                        customInput={
                          <CustomInput
                            dates={dates}
                            setDates={setDates}
                            label='Invoice Date'
                            end={endDateRange as number | Date}
                            start={startDateRange as number | Date}
                          />
                        }
                      />
                    </Grid>
                  </Grid>
                  <TabPanel sx={{ p: 0 }} value='overview'>
                    <DataGrid
                      autoHeight
                      pagination
                      rows={store.data}
                      columns={columns}
                      checkboxSelection
                      disableRowSelectionOnClick
                      pageSizeOptions={[10, 25, 50]}
                      paginationModel={paginationModel}
                      onPaginationModelChange={setPaginationModel}
                      onRowSelectionModelChange={rows => setSelectedRows(rows)}
                    />
                  </TabPanel>
                  <TabPanel sx={{ p: 0 }} value='security'>
                    <DataGrid
                      autoHeight
                      pagination
                      rows={store.data}
                      columns={columns}
                      checkboxSelection
                      disableRowSelectionOnClick
                      pageSizeOptions={[10, 25, 50]}
                      paginationModel={paginationModel}
                      onPaginationModelChange={setPaginationModel}
                      onRowSelectionModelChange={rows => setSelectedRows(rows)}
                    />
                  </TabPanel>
                </>
              </Box>
            </TabContext>
          </Card>
        </Grid>
      </Grid>
    </DatePickerWrapper>
  )
}

export default InvoiceList
