document.addEventListener('DOMContentLoaded', () => {
    // Retrieve values from localStorage
    const yealinkW79P = parseInt(localStorage.getItem('yealinkW79P')) || 0;
    const yealinkT54 = parseInt(localStorage.getItem('yealinkT54')) || 0;
    const yealinkT57 = parseInt(localStorage.getItem('yealinkT57')) || 0;
    const grandstreamGVX = parseInt(localStorage.getItem('grandstreamGVX')) || 0;

    const updateQuantityDisplay = (id, quantity) => {
        if (quantity > 0) {
            document.getElementById(id).textContent = quantity;
        } else {
            document.getElementById('item-' + id.split('-')[1]).style.display = 'none';
        }
    };

    updateQuantityDisplay('summary-yealink-w79p', yealinkW79P);
    updateQuantityDisplay('summary-yealink-t54', yealinkT54);
    updateQuantityDisplay('summary-yealink-t57', yealinkT57);
    updateQuantityDisplay('summary-grandstream-gvx', grandstreamGVX);

    document.getElementById('summary-old-call-charges').textContent = parseFloat(localStorage.getItem('oldCallCharges')).toFixed(2) || '0.00';
    document.getElementById('summary-old-equipment-rental').textContent = parseFloat(localStorage.getItem('oldEquipmentRental')).toFixed(2) || '0.00';
    document.getElementById('summary-old-service-charges').textContent = parseFloat(localStorage.getItem('oldServiceCharges')).toFixed(2) || '0.00';
    document.getElementById('summary-old-other-costs').textContent = parseFloat(localStorage.getItem('oldOtherCosts')).toFixed(2) || '0.00';
    document.getElementById('summary-old-mobile-costs').textContent = parseFloat(localStorage.getItem('oldMobileCosts')).toFixed(2) || '0.00';
    document.getElementById('summary-old-leaseline-costs').textContent = parseFloat(localStorage.getItem('oldLeaselineCosts')).toFixed(2) || '0.00';

    const totalOldCost = parseFloat(localStorage.getItem('oldCallCharges')) +
        parseFloat(localStorage.getItem('oldEquipmentRental')) +
        parseFloat(localStorage.getItem('oldServiceCharges')) +
        parseFloat(localStorage.getItem('oldOtherCosts')) +
        parseFloat(localStorage.getItem('oldMobileCosts')) +
        parseFloat(localStorage.getItem('oldLeaselineCosts'));

    document.getElementById('summary-total-old-cost').textContent = totalOldCost.toFixed(2);

    document.getElementById('summary-estimated-call-charges').textContent = '0.00'; // As no direct input
    document.getElementById('summary-new-system-rental').textContent = parseFloat(localStorage.getItem('newSystemRental')).toFixed(2) || '0.00';
    document.getElementById('summary-new-service-charges').textContent = parseFloat(localStorage.getItem('newServiceCharges')).toFixed(2) || '0.00';
    document.getElementById('summary-network-rebate').textContent = parseFloat(localStorage.getItem('networkRebate')).toFixed(2) || '0.00';
    document.getElementById('summary-estimated-mobile-charges').textContent = '0.00'; // As no direct input
    document.getElementById('summary-lease-line').textContent = '0.00'; // As no direct input

    const totalFutureCost = parseFloat(localStorage.getItem('newSystemRental')) +
        parseFloat(localStorage.getItem('newServiceCharges')) +
        parseFloat(localStorage.getItem('networkRebate'));

    document.getElementById('summary-total-future-cost').textContent = totalFutureCost.toFixed(2);

    // Update quantity of system user licenses
    const systemUserLicensesQty = yealinkW79P + yealinkT54 + yealinkT57 + grandstreamGVX;
    document.getElementById('summary-system-user-licenses').textContent = systemUserLicensesQty;
});

function proceedToCustomerInfo() {
    window.location.href = 'cug.html'; // Make sure this matches the filename for the customer information page
}
