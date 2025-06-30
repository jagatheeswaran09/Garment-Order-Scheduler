import React, { useState } from 'react';
import { Box, Grid, Typography, Paper, Tooltip } from '@mui/material';
import { styled } from '@mui/material/styles';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import dayjs from 'dayjs';

const days = [
  '2025-06-09', '2025-06-10', '2025-06-11', '2025-06-12', '2025-06-13', '2025-06-14', '2025-06-15', '2025-06-16'
];

const lines = [
  { id: 'DG1', name: 'DG - Line 1', capacity: 1000 },
  { id: 'DG2', name: 'DG - Line 2', capacity: 850 },
  { id: 'DG3', name: 'DG - Line 3 (Cutting)', capacity: 5000 },
  { id: 'SH1', name: 'SH - Line 1', capacity: 1200 },
  { id: 'SH2', name: 'SH - Line 2 (Finishing)', capacity: 2000 },
];

const ordersData = {
  order1: { id: 'order1', name: "Men's Basic Crew", qty: 1000, color: '#1976d2' },
  order2: { id: 'order2', name: "Unisex Hoodie", qty: 1200, color: '#d81b60' },
};

const initialSchedule = {
  'DG1-2025-06-10': ['order1'],
  'SH1-2025-06-12': ['order2'],
};

const OrderBlock = styled(Paper)(({ theme, bgcolor }) => ({
  padding: theme.spacing(1),
  textAlign: 'center',
  color: '#fff',
  backgroundColor: bgcolor || theme.palette.primary.main,
  cursor: 'grab',
}));

const SchedulerBoard = () => {
  const [schedule, setSchedule] = useState(initialSchedule);

  const onDragEnd = (result) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;

    const sourceKey = source.droppableId;
    const destKey = destination.droppableId;

    const sourceTasks = Array.from(schedule[sourceKey] || []);
    const destTasks = Array.from(schedule[destKey] || []);

    sourceTasks.splice(source.index, 1);
    destTasks.splice(destination.index, 0, draggableId);

    setSchedule({
      ...schedule,
      [sourceKey]: sourceTasks,
      [destKey]: destTasks,
    });
  };

  const isWeekend = (dateStr) => {
    const day = dayjs(dateStr).day();
    return day === 0 || day === 6;
  };

  return (
    <Box display="flex">
      {/* Sidebar */}
      <Box width="200px" borderRight="1px solid #ccc">
        <Typography variant="h6" sx={{ p: 2 }}>Resources</Typography>
        {lines.map(line => (
          <Box key={line.id} sx={{ p: 1, borderBottom: '1px solid #eee' }}>{line.name}</Box>
        ))}
      </Box>

      {/* Scheduler */}
      <Box overflow="auto" sx={{ flex: 1 }}>
        <DragDropContext onDragEnd={onDragEnd}>
          <Grid container>
            {/* Header */}
            <Grid container item>
              {days.map(date => (
                <Grid item key={date} xs={1.5} sx={{ p: 1, bgcolor: isWeekend(date) ? '#f0f0f0' : 'white' }}>
                  <Typography variant="subtitle2">{dayjs(date).format('ddd DD')}</Typography>
                </Grid>
              ))}
            </Grid>

            {/* Line rows */}
            {lines.map(line => (
              <Grid container item key={line.id}>
                {days.map(date => {
                  const droppableId = `${line.id}-${date}`;
                  const isHoliday = isWeekend(date);

                  return (
                    <Grid item key={date} xs={1.5} sx={{ border: '1px solid #eee', height: 80 }}>
                      <Droppable droppableId={droppableId} isDropDisabled={isHoliday} direction="vertical">
                        {(provided) => (
                          <Box
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            sx={{ height: '100%', p: 0.5, bgcolor: isHoliday ? '#f0f0f0' : 'inherit' }}
                          >
                            {(schedule[droppableId] || []).map((orderId, idx) => {
                              const order = ordersData[orderId];
                              return (
                                <Draggable draggableId={orderId} index={idx} key={orderId}>
                                  {(provided) => (
                                    <Tooltip title={`${order.name} (${order.qty})`}>
                                      <OrderBlock
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        bgcolor={order.color}
                                      >
                                        {order.name}
                                      </OrderBlock>
                                    </Tooltip>
                                  )}
                                </Draggable>
                              );
                            })}
                            {provided.placeholder}
                            <Typography variant="caption">
                              {line.capacity} / {(schedule[droppableId]?.length || 0) * 500}
                            </Typography>
                          </Box>
                        )}
                      </Droppable>
                    </Grid>
                  );
                })}
              </Grid>
            ))}
          </Grid>
        </DragDropContext>
      </Box>
    </Box>
  );
};

export default SchedulerBoard;
