/*!
    * Start Bootstrap - SB Admin v7.0.5 (https://startbootstrap.com/template/sb-admin)
    * Copyright 2013-2022 Start Bootstrap
    * Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-sb-admin/blob/master/LICENSE)
    */
    // 
// Scripts
// 

window.addEventListener('DOMContentLoaded', event => {

    // Toggle the side navigation
    const sidebarToggle = document.body.querySelector('#sidebarToggle');
    if (sidebarToggle) {
        // Uncomment Below to persist sidebar toggle between refreshes
        // if (localStorage.getItem('sb|sidebar-toggle') === 'true') {
        //     document.body.classList.toggle('sb-sidenav-toggled');
        // }
        sidebarToggle.addEventListener('click', event => {
            event.preventDefault();
            document.body.classList.toggle('sb-sidenav-toggled');
            localStorage.setItem('sb|sidebar-toggle', document.body.classList.contains('sb-sidenav-toggled'));
        });
    }

});
// Datatables
$(document).ready(function () {
    $('#dataProduct').DataTable({
        "order": [ 6, 'desc' ]
    }
    );
});

$(document).ready(function () {
    $('#dataUser').DataTable();
});
$(document).ready(function () {
    $('#dataOrder1').DataTable({
        "order": [7, 'desc']
    });
});

$(document).ready(function () {
    $('#dataOrder2').DataTable({
        "order": [8, 'desc']
    });
});

$(document).ready(function () {
    $('#dataOrder3').DataTable({
        "order": [8, 'desc']
    });
});


$(document).ready(function () {
    $('#dataOrder4').DataTable({
        "order": [8, 'desc']
    });
});





