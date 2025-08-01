import { Box, Button, Chip, IconButton, Menu, MenuItem, Toolbar, Tooltip, Typography, useColorScheme, useTheme } from "@mui/material"
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import CloseIcon from '@mui/icons-material/Close';
import { useState } from "react";
import { useStatusColor } from "../../hooks";
import { statusOptions, type OrderStatus } from "../../../types/orders";
import { updateMultipleOrderStatuses } from "../../features/orders/orderSlice";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../app/store";
import { useSnackbar } from "notistack";

export const BulkActions = ({ selectedOrdersId, onUnSelectedOrder }: { selectedOrdersId: string[], onUnSelectedOrder: () => void }) => {
  const theme = useTheme()
  const { mode } = useColorScheme()
  const getStatusColor = useStatusColor()
  const dispatch = useDispatch<AppDispatch>();
  const { enqueueSnackbar } = useSnackbar();
  const [bulkActionAnchor, setBulkActionAnchor] = useState<null | HTMLElement>(null);


  const handleBulkStatusChange = (status: OrderStatus) => {
    setBulkActionAnchor(null);

    // In a real app, you make backend Call to update the order in the Database first 
    dispatch(updateMultipleOrderStatuses({ ids: selectedOrdersId, status }))

    enqueueSnackbar(`Marked ${selectedOrdersId.length} orders as ${status}`, {
      variant: 'success',
    });

    onUnSelectedOrder()
  };


  const handleBulkActionClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setBulkActionAnchor(event.currentTarget);
  };

  return (
    <Toolbar sx={{
      backgroundColor: mode === 'dark'
        ? 'rgba(30, 30, 30, 0.7)'
        : 'rgba(241, 243, 245, 0.9)',
      borderBottom: `1px solid ${theme.palette.divider}`,
      display: 'flex',
      justifyContent: 'space-between',
      p: 2
    }}>
      <Box display="flex" alignItems="center">
        <Typography variant="subtitle1" fontWeight={600}>
          {selectedOrdersId.length} selected
        </Typography>
      </Box>

      <Box display="flex" gap={1}>
        <Button
          variant="contained"
          endIcon={<ArrowDropDownIcon />}
          onClick={handleBulkActionClick}
          sx={{
            textTransform: 'none',
          }}
        >
          Update Status
        </Button>

        <Menu
          anchorEl={bulkActionAnchor}
          open={Boolean(bulkActionAnchor)}
          onClose={() => setBulkActionAnchor(null)}
        >
          {statusOptions.map(status => (
            <MenuItem onClick={() => handleBulkStatusChange(status)}>
              Mark as
              <Chip
                label={status}
                size="small"
                sx={{
                  ml: 1,
                  fontWeight: 600,
                  backgroundColor: getStatusColor(status),
                  color: theme.palette.getContrastText(getStatusColor(status)),
                  width: '100%'
                }}
              />
            </MenuItem>
          ))}
        </Menu>

        <Tooltip title="Clear selection">
          <IconButton onClick={onUnSelectedOrder}>
            <CloseIcon />
          </IconButton>
        </Tooltip>
      </Box>
    </Toolbar>
  )
}
