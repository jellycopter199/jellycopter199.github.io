window.updateCosts = function () {
    const yealinkW79PQty = parseInt(document.getElementById('yealink-w79p').value) || 0;
    const yealinkT54Qty = parseInt(document.getElementById('yealink-t54').value) || 0;
    const yealinkT57Qty = parseInt(document.getElementById('yealink-t57').value) || 0;
    let mobileConnectQty = parseInt(document.getElementById('mobile-connect').textContent) || 0;
    const voiceChannels = parseInt(document.getElementById('voice-channels').value) || 0;

    const businessInternetValue = document.getElementById('business-internet').value;
    const businessInternetService = parseInt(document.getElementById('business-internet').selectedOptions[0].getAttribute('data-service')) || 0;

    const adjustSystemRental = parseFloat(document.getElementById('adjust-system-rental').value) || 0;
    const adjustRebate = parseFloat(document.getElementById('adjust-rebate').value) || 0;
    const adjustService = parseFloat(document.getElementById('adjust-service').value); // Get the adjust service value
    const typedTotalCosts = parseFloat(document.getElementById('adjust-total-costs').value);
    const newServiceChargesElement = document.getElementById('new-service-charges'); // Target element for newServiceCharges

    const routerCost = parseInt(document.getElementById('router').value) || 0;
    const terminationAmount = parseFloat(document.getElementById('terminations').value) || 0;

    const oldCallCharges = parseFloat(document.getElementById('old-call-charges').textContent) || 0;
    const oldEquipmentRental = parseFloat(document.getElementById('old-equipment-rental').textContent) || 0;
    const oldServiceCharges = parseFloat(document.getElementById('old-service-charges').textContent) || 0;
    const oldOtherCosts = parseFloat(document.getElementById('old-other-costs').textContent) || 0;
    const oldMobileCosts = parseFloat(document.getElementById('old-mobile-costs').textContent) || 0;
    const oldLeaselineCosts = parseFloat(document.getElementById('old-leaseline-costs').textContent) || 0;
    const webdev = parseFloat(document.getElementById('webdev').value) || 0;
    const contractTerm = parseInt(document.getElementById('contract-term').value);

    
    const phone60 = 17.50;
    const phone84 = 17.50;
    const computer60 = 17;

    
    const totalPhones = yealinkW79PQty + yealinkT54Qty + yealinkT57Qty;
    mobileConnectQty = totalPhones;
    document.getElementById('mobile-connect').textContent = mobileConnectQty;

    
    let phonesTotal = 0;
    if (totalPhones > 0 && contractTerm === 60) {
        phonesTotal = totalPhones * phone60;
    } else if (totalPhones > 0 && contractTerm === 84) {
        phonesTotal = totalPhones * phone84;
    }

    
    const newSystemRental = phonesTotal + adjustSystemRental;

    
    if (totalPhones > 0) {
        document.getElementById('ohm').textContent = '1';
        document.getElementById('call-recording').textContent = '1';
        document.getElementById('auto-attendant').textContent = '1';
        document.getElementById('voicemail-license').textContent = '1';
    } else {
        document.getElementById('ohm').textContent = '0';
        document.getElementById('call-recording').textContent = '0';
        document.getElementById('auto-attendant').textContent = '0';
        document.getElementById('voicemail-license').textContent = '0';
    }

    
    const totalFutureCost = typedTotalCosts;
    const newServiceCharges = totalFutureCost - newSystemRental + 250;

    
    document.getElementById('new-system-rental').textContent = `${newSystemRental.toFixed(2)}`;
    newServiceChargesElement.textContent = `${newServiceCharges.toFixed(2)}`;

    document.getElementById('total-future-cost').textContent = `${totalFutureCost.toFixed(2)}`;
    document.getElementById('system-user-licenses').textContent = `${totalPhones}`;
}


window.alternativeCosts = function () {
    const typedTotalCosts = parseFloat(document.getElementById('adjust-total-costs').value);
    document.getElementById('total-future-cost').textContent = typedTotalCosts;

    const typedRebate = parseFloat(document.getElementById('adjust-rebate').value);
    document.getElementById('network-rebate').textContent = typedRebate;

    const typedServiceCharge = document.getElementById('adjust-service').value;
    document.getElementById('new-service-charges').textContent = typedServiceCharge;

    const typedRental = parseFloat(document.getElementById('adjust-system-rental').value);
    document.getElementById('new-system-rental').textContent = typedRental;
}

// Initial binding of the default function to the onchange event
document.querySelectorAll('input, select').forEach(element => {
    element.addEventListener('onchange', window.updateCosts);
});

// Event listener for "Stop formula" button - switch to alternativeCosts
document.getElementById("stopFormula").addEventListener("click", function () {
    // Replace the updateCosts function with alternativeCosts for all inputs dynamically
    document.querySelectorAll('input, select').forEach(element => {
        element.removeEventListener('onchange', window.updateCosts);
        element.addEventListener('onchange', window.alternativeCosts);
    });
    console.log("Switched to alternativeCosts() bitxhs");
});

// Event listener for "Enable formula" button - switch back to updateCosts
document.getElementById("enableFormula").addEventListener("click", function () {
    // Replace the alternativeCosts function with updateCosts for all inputs dynamically
    document.querySelectorAll('input, select').forEach(element => {
        element.removeEventListener('onchange', window.alternativeCosts);
        element.addEventListener('onchange', window.updateCosts);
    });
    console.log("Switched back to updateCosts()");
});
