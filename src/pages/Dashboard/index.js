import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import {
    Box,
    Grid,
    Paper,
    Typography,
    CircularProgress,
    List,
    ListItem,
    ListItemText,
    useMediaQuery,
    useTheme
} from '@mui/material';
import { BarChart } from '@mui/x-charts/BarChart';
import { PieChart } from '@mui/x-charts/PieChart';

const Dashboard = () => {
    const [salesData, setSalesData] = useState([]);
    const [topItems, setTopItems] = useState([]);
    const [focusList, setFocusList] = useState([]);
    const [servedCustomers, setServedCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [topCustomers, setTopCustomers] = useState([]);
    const [topSubCategories, setTopSubCategories] = useState([]);
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const hasFetched = useRef(false);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    useEffect(() => {
        if (!hasFetched.current) {
            hasFetched.current = true;
            fetchData();
        }
    }, []);

    const fetchData = async () => {
        try {
            const res = await axios.get(`${process.env.REACT_APP_SALES_URL}/monthly-sales-dashboard`);
            const data = res.data;

            setSalesData(data['how a particular rep performed for a month – sales, vs previous year same month']?.data || []);
            setTopCustomers(
                data['top performing customer']?.data?.slice(0, 5).map((cust) => ({
                    id: cust.CardCode,
                    value: cust.TotalSales,
                    label: cust.CardName,
                })) || []
            );
            setTopItems(
                data['top items sold']?.data?.slice(0, 5).map(item => ({
                    id: item.ItemCode,
                    value: item.TotalSold,
                    label: item.ItemCode
                })) || []
            );
            setTopSubCategories(
                data['top item sub category gave higher sales']?.data?.slice(0, 5).map((cat) => ({
                    label: cat.SubCatNum,
                    value: cat.TotalSales,
                })) || []
            );
            setFocusList(
                data['which category of item and customer he can focus more']?.data?.slice(0, 5).map((item, index) => ({
                    id: index,
                    value: item.Count || item.SalesCount || 0,
                    label: item.Dscription || item.ItemCode || `Item ${index + 1}`
                })) || []
            );
            setServedCustomers(
                data['List the customers who were served by the sales representative during the given month, and list the customers who were not served by the same representative in that month']?.data || []
            );
        } catch (err) {
            console.error('Failed to load dashboard data:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Box sx={{ textAlign: 'center', mt: 10 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ p: isMobile ? 1 : 3 }}>
            <Typography variant="h5" gutterBottom textAlign="center">Sales Dashboard</Typography>

            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Paper elevation={3} sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>Monthly Sales (vs Last Year)</Typography>
                        <BarChart
                            xAxis={[{
                                scaleType: 'band',
                                data: salesData.map(d => `${monthNames[d.Month - 1]}-${d.Year}`)
                            }]}
                            series={[{
                                data: salesData.map(d => d.TotalSales),
                                label: 'Sales',
                                color: '#1976d2'
                            }]}
                            width={isMobile ? 350 : 1200}
                            height={300}
                        />
                    </Paper>
                </Grid>

                <Grid item xs={12} sm={6}>
                    <Paper elevation={3} sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>Top Items Sold</Typography>
                        <PieChart
                            series={[{ data: topItems, innerRadius: 40 }]}
                            width={isMobile ? 300 : 500}
                            height={300}
                        />
                    </Paper>
                </Grid>

                <Grid item xs={12} sm={6}>
                    <Paper elevation={3} sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>Top Performing Customers</Typography>
                        <PieChart
                            series={[{ data: topCustomers, innerRadius: 40 }]}
                            width={isMobile ? 300 : 300}
                            height={300}
                        />
                    </Paper>
                </Grid>

                <Grid item xs={12} sm={6}>
                    <Paper elevation={3} sx={{ p: 2 }}>
                        <Typography variant="h6">Recommended Focus Categories</Typography>
                        {focusList.length > 0 ? (
                            <PieChart
                                series={[{
                                    data: focusList,
                                    innerRadius: 40,
                                    outerRadius: 100
                                }]}
                                width={isMobile ? 300 : 500}
                                height={300}
                            />
                        ) : (
                            <Typography>No focus data available</Typography>
                        )}
                    </Paper>
                </Grid>

                <Grid item xs={12} sm={6}>
                    <Paper elevation={3} sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>Top Item Subcategory</Typography>
                        {topSubCategories.length > 0 && (
                            <BarChart
                                xAxis={[{
                                    scaleType: 'band',
                                    data: topSubCategories.map((d) => d.label),
                                }]}
                                series={[{
                                    data: topSubCategories.map((d) => d.value),
                                    label: 'Sales',
                                    color: '#9c27b0',
                                }]}
                                width={isMobile ? 300 : 570}
                                height={260}
                            />
                        )}
                    </Paper>
                </Grid>

                <Grid item xs={12}>
                    <Paper elevation={3} sx={{ p: 2, maxHeight: 300, overflowY: 'auto' }}>
                        <Typography variant="h6">Served Customers</Typography>
                        <List dense>
                            {servedCustomers.map((cust, i) => (
                                <ListItem key={i}>
                                    <ListItemText primary={cust.CardName} />
                                </ListItem>
                            ))}
                        </List>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Dashboard;
