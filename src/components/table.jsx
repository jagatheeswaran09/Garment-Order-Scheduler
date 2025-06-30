import React, { useState } from 'react';
import {
    Paper,
    TableContainer,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    IconButton,
    Box,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

const CustomTable = ({
    columns = [],
    dataSource = [],
    onEdit,
    onDelete,
    noDataText = 'No data available',
    stickyHeader = true,
    maxHeight = 440
}) => {
    const [deleteModal, setDeleteModal] = useState({ id: null, open: false })
    const hasActions = onEdit || onDelete;

    const handleDeleteModal = (value) => {
        setDeleteModal({ id: value, open: !deleteModal.open })
    }

    const handleDeleteModalConfirmation = () => {
        onDelete(deleteModal.id)
        handleDeleteModal()
    }

    const handleCloseModal = () => {
        setDeleteModal({ id: null, open: !deleteModal.open })
    }

    return (
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <TableContainer sx={{ maxHeight, width: "100%" }}>
                <Table stickyHeader={stickyHeader} aria-label="custom table">
                    <TableHead>
                        <TableRow>
                            {columns.map((column) => (
                                <TableCell
                                    key={column.key}
                                    align={column.align || 'left'}
                                    sx={{ minWidth: column.minWidth }}
                                    style={{ fontWeight: "bold" }}
                                >
                                    {column.title}
                                </TableCell>
                            ))}
                            {hasActions && (
                                <TableCell align="right" style={{ fontWeight: "bold" }}>Actions</TableCell>
                            )}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {dataSource.length > 0 ? (
                            dataSource.map((row, rowIndex) => (
                                <TableRow key={row.id || rowIndex}>
                                    {columns.map((column) => (
                                        <TableCell
                                            key={column.key}
                                            align={column.align || 'left'}
                                        >
                                            {column.render
                                                ? column.render(row[column.dataIndex], row)
                                                : row[column.dataIndex]
                                            }
                                        </TableCell>
                                    ))}
                                    {hasActions && (
                                        <TableCell align="right">
                                            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                                {onEdit && (
                                                    <IconButton
                                                        color="primary"
                                                        onClick={() => onEdit(row)}
                                                        aria-label="edit"
                                                        size="small"
                                                    >
                                                        <Edit fontSize="small" />
                                                    </IconButton>
                                                )}
                                                {onDelete && (
                                                    <IconButton
                                                        color="error"
                                                        onClick={() => handleDeleteModal(row.id || rowIndex)}
                                                        aria-label="delete"
                                                        size="small"
                                                    >
                                                        <Delete fontSize="small" />
                                                    </IconButton>
                                                )}
                                            </Box>
                                        </TableCell>
                                    )}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length + (hasActions ? 1 : 0)} align="center">
                                    <Typography variant="body2" color="text.secondary">
                                        {noDataText}
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog
                open={deleteModal.open}
                onClose={handleCloseModal}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle>
                    {"Delete Confirmation"}
                </DialogTitle>
                <DialogContent>
                    Are you sure want to delete this record?
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseModal}>Cancel</Button>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        onClick={handleDeleteModalConfirmation}
                    >
                        Okay
                    </Button>
                </DialogActions>
            </Dialog>
        </Paper>
    );
};

export default CustomTable;