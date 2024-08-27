import React, { useState } from 'react';
import './DefaultModalContent.css'; // Reference to the default stylesheet
import './FinanceManagementModalContent.css'; // Reference to the custom stylesheet for additional styles

const Tab = ({ children, activeTab, label, onClick }) => (
    <li className={`tab-item ${activeTab === label ? 'active' : ''}`} onClick={() => onClick(label)}>
        {label}
    </li>
);

const Tabs = ({ children }) => {
    const [activeTab, setActiveTab] = useState(children[0].props.label);

    const onClickTabItem = (tab) => {
        setActiveTab(tab);
    };

    return (
        <div className="tabs">
            <ul className="tab-list">
                {children.map((child) => {
                    const { label } = child.props;

                    return (
                        <Tab
                            activeTab={activeTab}
                            key={label}
                            label={label}
                            onClick={onClickTabItem}
                        />
                    );
                })}
            </ul>
            <div className="tab-content">
                {children.map((child) => {
                    if (child.props.label !== activeTab) return undefined;
                    return child.props.children;
                })}
            </div>
        </div>
    );
};

const FinanceManagementModalContent = ({ node, sunburstGraphRef, onRequestClose }) => {
    const { details } = node;
    const income = details?.income || {};
    const assets = details?.assets || {};
    const savingsAndInvestments = details?.savings_and_investments || {};
    const liabilities = details?.liabilities || {};
    const netWorth = details?.net_worth || {};
    const expenses = details?.expenses || {};

    const [updateSheetMode, setUpdateSheetMode] = useState(false);
    const [spreadsheetId, setSpreadsheetId] = useState('');
    const [range, setRange] = useState('');
    const [updateMode, setUpdateMode] = useState('replace');

    const handleSpreadsheetIdChange = (e) => {
        setSpreadsheetId(e.target.value);
    };

    const handleRangeChange = (e) => {
        setRange(e.target.value);
    };

    const handleUpdateModeChange = (e) => {
        setUpdateMode(e.target.value);
    };

    const handleUpdateSpreadsheet = async () => {
        if (!spreadsheetId || !range) {
            alert('Please provide both Spreadsheet ID and range.');
            return;
        }

        if (!window.confirm('Are you sure you want to update the data from this Google Sheet?')) {
            return;
        }

        try {
            const endpoint = updateMode === 'replace' ? 'sheet_replace_finance_data' : 'merge_finance_data';
            const response = await fetch(`${process.env.REACT_APP_API_ENDPOINT}/${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ spreadsheet_id: spreadsheetId, range: range }),
            });
            const result = await response.json();

            if (result.success) {
                alert('Data updated successfully.');
                setUpdateSheetMode(false);
                if (sunburstGraphRef.current) {
                    sunburstGraphRef.current.refresh();
                }
            } else {
                alert('Failed to update data: ' + result.message);
            }
        } catch (error) {
            alert('An error occurred while updating data: ' + error.message);
        }
    };

    const renderSection = (title, subtitle, data, columns) => (
        <div className="section">
            <h2>{title}</h2>
            <p>{subtitle}</p>
            {data.length > 0 ? (
                <table className="data-table">
                    <thead>
                    <tr>
                        {columns.map((column, index) => (
                            <th key={index}>{column}</th>
                        ))}
                    </tr>
                    </thead>
                    <tbody>
                    {data.map((item, index) => (
                        <tr key={index}>
                            {columns.map((column, colIndex) => {
                                // Define a direct mapping for the recurring detail fields
                                if (column === "Recurring Amount") {
                                    return <td key={colIndex}>{item.recurring_detail?.recurring_amount || "N/A"}</td>;
                                } else if (column === "Frequency") {
                                    return <td key={colIndex}>{item.recurring_detail?.frequency || "N/A"}</td>;
                                } else if (column === "Day") {
                                    return <td key={colIndex}>{item.recurring_detail?.recurring_day || "N/A"}</td>;
                                } else if (column === "Month") {
                                    return <td key={colIndex}>{item.recurring_detail?.recurring_month || "N/A"}</td>;
                                } else if (column === "Start Date") {
                                    return <td key={colIndex}>{item.recurring_detail?.start_date || "N/A"}</td>;
                                } else if (column === "End Date") {
                                    return <td key={colIndex}>{item.recurring_detail?.end_date || "N/A"}</td>;
                                } else {
                                    // For other fields, map them directly from the item
                                    const fieldName = column.toLowerCase().replace(/ /g, '_');
                                    return <td key={colIndex}>{item[fieldName] || "N/A"}</td>;
                                }
                            })}
                        </tr>
                    ))}
                    </tbody>
                </table>
            ) : (
                <p>- There is no data yet for this section...</p>
            )}
        </div>
    );



    return (
        <div className="modal-container">
            <div className="header">
                {details && (
                    <>
                        <h1>{details.name}</h1>
                        {details.start_date && details.end_date && (
                            <p>{details.start_date} to {details.end_date}</p>
                        )}
                    </>
                )}
                <button onClick={() => setUpdateSheetMode(!updateSheetMode)}>Update Spreadsheet Source</button>
                {updateSheetMode && (
                    <div className="update-sheet-section">
                        <input
                            type="text"
                            placeholder="Enter Spreadsheet ID"
                            value={spreadsheetId}
                            onChange={handleSpreadsheetIdChange}
                        />
                        <input
                            type="text"
                            placeholder="Enter Range (e.g., Sheet1!A1:D10)"
                            value={range}
                            onChange={handleRangeChange}
                        />
                        <div>
                            <label>
                                <input
                                    type="radio"
                                    value="replace"
                                    checked={updateMode === 'replace'}
                                    onChange={handleUpdateModeChange}
                                />
                                Replace
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    value="merge"
                                    checked={updateMode === 'merge'}
                                    onChange={handleUpdateModeChange}
                                />
                                Merge
                            </label>
                        </div>
                        <button onClick={handleUpdateSpreadsheet}>Update</button>
                    </div>
                )}
            </div>
            <div className="content">
                <Tabs>
                    <div label="Income">
                        {renderSection("Income: Salary", "Salary", income.salary || [], ["Name", "Source", "Comments", "Destination Account", "Recurring Amount", "Frequency", "Day", "Month", "Start Date", "End Date"])}
                        {renderSection("Income: Business Income", "Business Income", income.business_income || [], ["Name", "Source", "Comments", "Destination Account", "Recurring Amount", "Frequency", "Day", "Month", "Start Date", "End Date"])}
                        {renderSection("Income: Investment Income", "Investment Income (interest, dividends, capital gains)", income.investment_income || [], ["Name", "Type", "Comments", "Recurring Amount", "Frequency", "Day", "Month", "Start Date", "End Date"])}
                        {renderSection("Income: Other Income", "Other Income (rental income, royalties, etc.)", income.other_income || [], ["Name", "Type", "Comments", "Recurring Amount", "Frequency", "Day", "Month", "Start Date", "End Date"])}
                    </div>
                    <div label="Assets">
                        {renderSection("Assets: Savings Accounts", "Savings Accounts", assets.savings_accounts || [], ["Name", "Bank", "Balance", "Interest Rate", "Comments"])}
                        {renderSection("Assets: Checking Accounts", "Checking Accounts", assets.checking_accounts || [], ["Name", "Bank", "Balance", "Comments"])}
                        {renderSection("Assets: Real Estate", "Real Estate", assets.real_estate || [], ["Name", "Address", "Estimated Value", "Mortgage Balance", "Comments"])}
                        {renderSection("Assets: Personal Property", "Personal Property", assets.personal_property || [], ["Name", "Type", "Estimated Value", "Comments"])}
                    </div>
                    <div label="Savings and Investments">
                        {renderSection("Savings and Investments: Retirement Accounts", "Retirement Accounts (401(k), IRA)", savingsAndInvestments.retirement_accounts || [], ["Name", "Type", "Balance", "Contributions", "Comments"])}
                        {renderSection("Savings and Investments: Investment Accounts", "Investment Accounts (stocks, bonds, mutual funds)", savingsAndInvestments.investment_accounts || [], ["Name", "Type", "Balance", "Comments"])}
                        {renderSection("Savings and Investments: Education Savings", "Education Savings (529 plan, Coverdell ESA)", savingsAndInvestments.education_savings || [], ["Name", "Type", "Balance", "Contributions", "Comments"])}
                    </div>
                    <div label="Liabilities">
                        {renderSection("Liabilities: Loans", "Loans (student, personal, auto)", liabilities.loans || [], ["Name", "Type", "Balance", "Interest Rate", "Minimum Payment", "Comments", "Source Account", "Recurring Amount", "Frequency", "Day", "Month", "Start Date", "End Date"])}
                        {renderSection("Liabilities: Credit Cards", "Credit Cards", liabilities.credit_cards || [], ["Name", "Issuer", "Balance", "Interest Rate", "Minimum Payment", "Comments", "Recurring Amount", "Frequency", "Day", "Month", "Start Date", "End Date"])}
                        {renderSection("Liabilities: Mortgages", "Mortgages", liabilities.mortgages || [], ["Name", "Lender", "Balance", "Interest Rate", "Comments", "Recurring Amount", "Frequency", "Day", "Month", "Start Date", "End Date"])}
                        {renderSection("Liabilities: Other Debts", "Other Debts", liabilities.other_debts || [], ["Name", "Type", "Balance", "Interest Rate", "Minimum Payment", "Comments", "Recurring Amount", "Frequency", "Day", "Month", "Start Date", "End Date"])}
                    </div>
                    <div label="Net Worth">
                        <div className="section">
                            <h2>Net Worth</h2>
                            <p>Total Assets, Total Liabilities, Net Worth</p>
                            <div className="summary-content">
                                <p>Total Assets: {netWorth.total_assets || "No data available"}</p>
                                <p>Total Liabilities: {netWorth.total_liabilities || "No data available"}</p>
                                <p>Net Worth: {netWorth.net_worth || "No data available"}</p>
                            </div>
                        </div>
                    </div>
                    <div label="Expenses">
                        {renderSection("Expenses: Expense Items", "Expense Items (e.g., gas, food, entertainment)", expenses.expense_items || [], ["Name", "Category", "Comments", "Recurring Amount", "Frequency", "Day", "Month", "Start Date", "End Date"])}
                        {renderSection("Expenses: Subscriptions", "Subscriptions", expenses.subscriptions || [], ["Name", "Type", "Comments", "Source Account", "Recurring Amount", "Frequency", "Day", "Month", "Start Date", "End Date"])}
                        {renderSection("Expenses: Insurance Policies", "Insurance Policies (health, auto, home)", expenses.insurance_policies || [], ["Name", "Type", "Provider", "Premium", "Coverage Details", "Comments", "Recurring Amount", "Frequency", "Day", "Month", "Start Date", "End Date"])}
                    </div>
                </Tabs>
            </div>
            {details && (
                <div className="footer">
                    {details.notes && (
                        <p>{details.notes}</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default FinanceManagementModalContent;
