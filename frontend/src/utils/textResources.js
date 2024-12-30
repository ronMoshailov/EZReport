
  const textResources = {
    he: {
        // General
        direction: 'rtl',
        return: 'חזור',
        cancel: 'ביטול',
        areYouSure: 'האם אתה בטוח?',
        sending: 'שולח',
        sendNow: 'שלח',
        employeeNotExist: 'עובד לא נמצא במערכת',
        notSuccess: 'לא הצליח',
        reortNotCreated: 'דיווח לא נוצר',
        workspaceError: 'יש בעיה עם העמדה, אנה התחבר מחדש',
        InvalidOperation: 'סוג הפעולה לא תקינה',
        generalError: 'שגיאה במהלך הביצוע',
        // Login
        workspaceNumber: 'מספר עמדה',
        enterNumWorkspace: 'הכנס מספר עמדה...',
        login: 'התחבר',
        wait: 'המתן',
        // Dashboard
        name: 'שם',
        serialNum: 'מספר סידורי',
        status: 'סטטוס',
        currentStation: 'תחנה נוכחית',
        produced: 'יוצרו',
        packed: 'נארזו',
        ordered: 'הוזמנו',
        openedDate: 'תאריך פתיחה',
        startSession: 'תחילת עבודה',
        endSession: 'סיום ודיווח',
        send: 'שליחה',
        dashboardFilter: 'חפש לפי מספר סידורי...',
        station: 'עמדת',
        storage: 'מחסן',
        production: 'יצור',
        packing: 'אריזה',
        // Sliderbar
        paka: 'פקעו"ת',
        queue: 'תור',
        settings: 'הגדרות',
        quit: 'יציאה',
        // Error Page
        error: 'שגיאה',
        errorPageMessage: 'אירעה שגיאה במערכת. אנא נסה להתחבר מחדש',
        loginBack: 'התחבר מחדש',
        // Not Found
        pageNotFound404: '404 - דף לא קיים',
        pageNotFoundOps: 'אופס! הדף לא קיים',
        returnMainPage: 'חזרה לעמוד הראשי',
        // Storage
        enterNumberComponent: 'הכנס מספר רכיב...',
        enterQuantity: 'הכנס כמות...',
        comments: 'הערות',
        filterComponentByNameOrNumber: 'חפש רכיב לפי שם או מספר...',
        componentNum: 'מספר רכיב',
        quantity: 'כמות',
        componentList: 'רשימת הרכיבים',
        addComponentNum: 'הכנס מספר רכיב...',
        addComponent: 'הוסף רכיב',
        sendReporting: 'שלח דיווח',
        showReportComponents: 'הצג רכיבים בהזמנה',
        addComponentsInDB: 'כל הרכיבים במערכת',
        filterByComponentNum: 'חפש לפי מספר רכיב',
        // Comments Modal
        notAvailableComponents: 'אין הערות זמינות',
        // Components Modal
        componentList: 'רשימת רכיבים',
        // Production & Packing
        catalogNumber: 'מקט',
        good: 'תקינים',
        quantitySize: 'כמות יחידות',
        showComments: 'הצג הערות',
        enterCatalogNum: 'הכנס מקט...',
        // Settings
        chooseLanguage: 'בחר שפה',
        // Session Modal
        sendReport: 'שליחה לתחנה הבאה',
        receiveReport: 'קבלה לתחנה הנוכחית',
        employeeNum: 'מספר עובד',
        enterEmployeeNum: 'הכנס מספר עובד...',
        // Manager
        workOrderInWork: 'פקעו"ת בעבודה',
        workOrderNotInWork: 'פקעו"ת לא בעבודה',
        workOrderFinished: 'פקעו"ת שהסתיימו',
        workOrderPending: 'פקעו"ת ממתינות',
        employees: 'עובדים',
        addEmployee: 'הוסף עובד',
        removeEmployee: 'הסר עובד',
        components: 'רכיבים',
        removeComponent: 'הסר רכיב',
        addStock: 'הוסף כמות',
        updateStock: 'עדכן כמות',
        calcAve: 'זמן ממוצע לרכיב',
        workspace: 'תחנה',
        title: 'כותרת',
        updateStock: 'עדכן כמות',
        updateStock: 'עדכן כמות',
        moreOperation: 'פעולות נוספות',
        // Manager Modal
        employeeName: 'שם עובד',
        enterEmployeeName: 'הכנס שם עובד...',
        componentName: 'שם רכיב',
        enterComponentName: 'הכנס שם רכיב...',
        stock: 'מלאי',
        addingStock: 'הוספת מלאי',
        updatingStock: 'עדכון מלאי',
        calcAve: 'חשב ממוצע',
        calc: 'חשב',
        operationNotFound: 'לא נמצאה פעולה',
        pakaNumber: 'מספר פק"ע',
        EnterPaka: 'הכנס מספר פק"ע...',
        // Errors
        compNotFound: 'רכיב לא נמצא',               // 404
        serverError: 'שגיאה בשרת',                  // 500
        unexpectedError: 'שגיאה לא צפויה',          // exception
        compConflict: 'הרכיב כבר קיים בשרת',        // 409 
        invalidParameters: 'הנתונים לא תקינים',     // 400
        employeeNotFound: 'העובד לא נמצא במערכת',   // 404
        workspaceNotFound: 'מספר עמדה לא קיים',     // 404
        reportNotFound: 'דוח לא קיים במערכת',       // 404
        connectionFailed: 'החיבור לשרת לא הצליח',   // 500
        reportOrEmployeeNotFound: 'דוח או עובד לא נמצאו במערכת',                // 404
        reportOrSerialNumNotFound: 'דוח או המספר סיריאלי לא נמצאו במערכת',      // 404
        employeeStartedReporting: 'העובד כבר התחיל דיווח',                      // 409
        invalidQuantity: 'כמות לא תקינה',
        oversizeQuantity: 'הכמות שהוכנסה גבוהה ממה שהוזמן',
        employeeNotStartedReporting: 'העובד לא התחיל דיווח',
        missingData: 'נתונים חסרים',
        // Toast messages
        connectionToWorkspaceSucceeded: 'ההתחברות לעמדה הצליחה',
        emptyReport: 'הדיווח ריק',
        oversizeCapacity: 'הכמות הכוללת גדולה ממה שקיים במערכת',
        notPossibleEmptyEmployeeNumber: 'מספר עובד לא יכול להיות ריק',
        startSessionSuccessfully: 'התחלת הדיווח הצליחה',
        sendReportingSuccessfully: 'הדיווח נשלח בהצלחה',
    },
    en: {
        // General
        direction: 'ltr',
        return: 'Return',
        cancel: 'Cancel',
        areYouSure: 'Are you sure?',
        sending: 'Sending',
        sendNow: 'Send',
        employeeNotExist: 'Employee does not exist in the system',
        notSuccess: 'Operation was not successful',
        reportNotCreated: 'Report was not created',
        workspaceError: 'There is an issue with the workspace, please reconnect',
        InvalidOperation: 'The operation type is invalid',
        generalError: 'Error occurred during execution',
        // Login
        workspaceNumber: 'Workspace number',
        enterNumWorkspace: 'Enter workspace number...',
        login: 'Login',
        wait: 'Wait',
        // Dashboard
        name: 'Name',
        serialNum: 'Serial number',
        status: 'Status',
        currentStation: 'Current workspace',
        produced: 'Produced',
        packed: 'Packed',
        ordered: 'Ordered',
        openedDate: 'Opened date',
        startSession: 'Start session',
        endSession: 'End & Report',
        send: 'Send',
        dashboardFilter: 'Seach by serial number...',
        station: 'Workspace',
        storage: 'Storage',
        production: 'Production',
        packing: 'Packing',
        // Sliderbar
        paka: 'Work orders',
        queue: 'Queue',
        settings: 'Settings',
        quit: 'Quit',
        // Error Page
        error: 'Error',
        errorPageMessage: 'A system error has occurred. Please try logging in again.',
        loginBack: 'Login back',
        // Not Found
        pageNotFound404: 'Page not found - 404',
        pageNotFoundOps: 'Oops! The page does not exist.',
        returnMainPage: 'Back to main page',
        // Storage
        enterNumberComponent: 'Enter component number...',
        enterQuantity: 'Enter quantity...',
        comments: 'Comments',
        filterComponentByNameOrNumber: 'Search for a component by name or number...',
        componentNum: 'Component number',
        quantity: 'Quantity',
        componentList: 'Component list',
        addComponentNum: 'Enter component number...',
        enterQuantity: 'Enter quantity...',
        addComponent: 'Add a component',
        sendReporting: 'Send a report',
        showReportComponents: 'Show components on order',
        addComponentsInDB: 'All components in the system',
        filterByComponentNum: 'Search by component number',
        // Comments Modal
        notAvailableComponents: 'No comments available',
        // Components Modal
        componentList: 'List of components',
        // Production & Packing
        catalogNumber: 'Catalog number',
        good: 'Produced',
        quantitySize: 'Quantity of units',
        showComments: 'Sow comments',
        enterCatalogNum: 'Enter catalog number...',
        // Settings
        chooseLanguage: 'choose language',
        // Session Modal
        sendReport: 'Send to the next station',
        receiveReport: 'Receive at the current station',
        employeeNum: 'Employee Number',
        enterEmployeeNum: 'Enter Employee Number...',
        // Manager
        workOrderInWork: 'Work Orders in Progress',
        workOrderNotInWork: 'Work Orders Not in Progress',
        workOrderFinished: 'Completed Work Orders',
        workOrderPending: 'Pending Work Orders',
        employees: 'Employees',
        addEmployee: 'Add Employee',
        removeEmployee: 'Remove Employee',
        components: 'Components',
        removeComponent: 'Remove Component',
        addStock: 'Add Stock',
        updateStock: 'Update Stock',
        calcAve: 'Average Time per Component',
        workspace: 'Station',
        title: 'Title',
        updateStock: 'Update Stock',
        updateStock: 'Update Stock',
        // Manager Modal
        employeeName: 'Employee Name',
        enterEmployeeName: 'Enter employee name...',
        componentName: 'Component Name',
        enterComponentName: 'Enter component name...',
        stock: 'Stock',
        addingStock: 'Adding Stock',
        updatingStock: 'Updating Stock',
        calcAve: 'Calculate Average',
        calc: 'Calculate',
        operationNotFound: 'Operation not found',
        pakaNumber: 'Operation Work Number',
        EnterPaka: 'Enter Operation Work Number...',
        // Errors
        compNotFound: 'Component not found',               // 404
        serverError: 'Server error',                       // 500
        unexpectedError: 'Unexpected error',               // exception || unexpected error
        compConflict: 'The component already exists on the server', // 409
        invalidParameters: 'Invalid parameters',           // 400
        employeeNotFound: 'Employee not found in the system', // 404
        workspaceNotFound:  'Workspace number does not exist', // 404
        reportNotFound: 'Report does not exist in the system',       // 404
        connectionFailed: 'Failed to connect to the server',         // 500
        reportOrEmployeeNotFound: 'Report or employee not found in the system',    // 404
        reportOrSerialNumNotFound: 'Report or serial number not found in the system',    // 404
        employeeStartedReporting: 'The employee has already started reporting',   // 409
        invalidQuantity: 'Invalid quantity',
        oversizeQuantity: 'The entered quantity exceeds the ordered amount',
        employeeNotStartedReporting: 'The employee has not started reporting',
        missingData: 'Missing data',
        // Toast messages
        connectionToWorkspaceSucceeded: 'Successfully connected to the workspace',
        sentSuccessfully: 'Submission succeeded',
        emptyReport: 'The report is empty',
        oversizeCapacity: 'The total quantity exceeds what exists in the system',
        notPossibleEmptyEmployeeNumber: 'Employee number cannot be empty',
        startSessionSuccessfully: 'Session started successfully',
        sendReportingSuccessfully: 'Reporting sent successfully',
    },
    ru: {
        return: 'возврат',
        cancel: 'отмена',
        areYouSure: 'Вы уверены?',
        sending: 'отправка',
        sendNow: 'отправить',
        employeeNotExist: 'Сотрудник не найден в системе',
        notSuccess: 'Операция не удалась',
        reportNotCreated: 'Отчет не создан',
        workspaceError: 'Проблема с рабочим местом, пожалуйста, переподключитесь',
        InvalidOperation: 'Тип операции недействителен',
        generalError: 'Произошла ошибка при выполнении',
        // Login
        workspaceNumber: 'Номер рабочего места',
        enterNumWorkspace: 'Введите номер рабочего места...',
        login: 'Войти',
        wait: 'Ожидание',
        // Dashboard
        name: 'Имя',
        serialNum: 'Серийный номер',
        status: 'Статус',
        currentStation: 'Текущая рабочая станция',
        produced: 'Произведено',
        packed: 'Упаковано',
        ordered: 'Заказано',
        openedDate: 'Дата открытия',
        startSession: 'Начать сессию',
        endSession: 'Завершить и Отчет',
        send: 'Отправить',
        dashboardFilter: 'Поиск по серийному номеру...',
        station: 'Рабочая станция',
        storage: 'Склад',
        production: 'Производство',
        packing: 'Упаковка',
        // Sliderbar
        paka: 'Рабочие заказы',
        queue: 'Очередь',
        settings: 'Настройки',
        quit: 'Выйти',
        // Error Page
        error: 'Ошибка',
        errorPageMessage: 'Произошла системная ошибка. Пожалуйста, попробуйте войти снова.',
        loginBack: 'Вернуться ко входу',
        // Not Found
        pageNotFound404: 'Страница не найдена - 404',
        pageNotFoundOps: 'Упс! Страница не существует.',
        returnMainPage: 'Вернуться на главную страницу',
        // Storage
        enterNumberComponent: 'Введите номер компонента...',
        enterQuantity: 'Введите количество...',
        comments: 'Комментарии',
        filterComponentByNameOrNumber: 'Поиск компонента по названию или номеру...',
        componentNum: 'Номер компонента',
        quantity: 'Количество',
        componentList: 'Список компонентов',
        addComponentNum: 'Введите номер компонента...',
        enterQuantity: 'Введите количество...',
        addComponent: 'Добавить компонент',
        sendReporting: 'Отправить отчет',
        showReportComponents: 'Показать компоненты в заказе',
        addComponentsInDB: 'Все компоненты в системе',
        filterByComponentNum: 'Поиск по номеру компонента...',
        // Comments Modal
        notAvailableComponents: 'Комментарии недоступны',
        // Components Modal
        componentList: 'Список компонентов',
        // Production & Packing
        catalogNumber: 'Каталожный номер',
        good: 'ОК',
        quantitySize: 'Количество единиц',
        showComments: 'Показать комментарии',
        enterCatalogNum: 'Введите каталожный номер...',
        // Settings
        chooseLanguage: 'выберите язык',
        // Session Modal
        sendReport: 'Отправить на следующую станцию',
        receiveReport: 'Получить на текущей станции',
        employeeNum: 'Номер сотрудника',
        enterEmployeeNum: 'Введите номер сотрудника...',
        // Manager
        workOrderInWork: 'Рабочие заказы в процессе',
        workOrderNotInWork: 'Рабочие заказы не в процессе',
        workOrderFinished: 'Завершенные рабочие заказы',
        workOrderPending: 'Ожидающие рабочие заказы',
        employees: 'Сотрудники',
        addEmployee: 'Добавить сотрудника',
        removeEmployee: 'Удалить сотрудника',
        components: 'Компоненты',
        removeComponent: 'Удалить компонент',
        addStock: 'Добавить количество',
        updateStock: 'Обновить количество',
        calcAve: 'Среднее время на компонент',
        workspace: 'Станция',
        title: 'Заголовок',
        updateStock: 'Обновить количество',
        updateStock: 'Обновить количество',
        // Manager Modal
        employeeName: 'Имя сотрудника',
        enterEmployeeName: 'Введите имя сотрудника...',
        componentName: 'Название компонента',
        enterComponentName: 'Введите название компонента...',
        stock: 'Запас',
        addingStock: 'Добавление запаса',
        updatingStock: 'Обновление запаса',
        calcAve: 'Вычислить среднее',
        calc: 'Вычислить',
        operationNotFound: 'Операция не найдена',
        pakaNumber: 'Номер Пака',
        EnterPaka: 'Введите номер Пака...',
        // Error
        errorInServer: 'Ошибка на сервере',
        // Errors
        compNotFound: 'Компонент не найден',               // 404
        serverError: 'Ошибка на сервере',                  // 500
        unexpectedError: 'Неожиданная ошибка',             // exception
        compConflict: 'Компонент уже существует на сервере', // 409
        invalidParameters: 'Некорректные параметры',        // 400
        employeeNotFound: 'Сотрудник не найден в системе',  // 404
        workspaceNotFound: 'Номер рабочего места не существует', // 404
        reportNotFound: 'Отчет не существует в системе',       // 404
        connectionFailed: 'Не удалось подключиться к серверу',   // 500
        reportOrEmployeeNotFound: 'Отчет или сотрудник не найдены в системе',    // 404
        reportOrSerialNumNotFound: 'Отчет или серийный номер не найдены в системе',    // 404
        employeeStartedReporting: 'Сотрудник уже начал отчет',   // 409
        invalidQuantity: 'Недопустимое количество',
        oversizeQuantity: 'Введенное количество превышает заказанное',
        employeeNotStartedReporting: 'Сотрудник не начал отчет',
        missingData: 'Отсутствуют данные',
        // Toast messages
        connectionToWorkspaceSucceeded: 'Успешное подключение к рабочей станции',
        sentSuccessfully: 'Отправка успешна',
        emptyReport: 'Отчет пуст',
        oversizeCapacity: 'Общий объем превышает имеющийся в системе',
        notPossibleEmptyEmployeeNumber: 'Номер сотрудника не может быть пустым',
        startSessionSuccessfully: 'Сессия успешно начата',
        sendReportingSuccessfully: 'Отчет успешно отправлен',
    },
};

  export { textResources }
