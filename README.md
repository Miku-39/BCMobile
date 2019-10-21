BASE:
  tenant:
    visitor: создана
    car:     создана
    goods:   создана
    service: создана

LESNAYA:

  tenant:
    visitor: принята
    car:     создана, manager department = Л ? Зиновьев : Татаринова, observersText department = Л ? Курандикова
    goods:   department == 4006045944000 ? создана : принята, manager department = Л ? null : Татаринова
    service: создана, manager department = Л ? Зиновьев : Татаринова, observersText department = Л ? Курандикова, asignee = альфаком

  administratorBC && makingAgreementBC:
    visitor: принята
    car:     принята, manager department = Л ? Зиновьев : Татаринова, observersText department = Л ? Курандикова
    goods:   принята, manager department = Л ? null : Татаринова
    service: принята, manager department = Л ? Зиновьев : Татаринова, observersText department = Л ? Курандикова, asignee = альфаком

  restrictedAdministatorBC && makingAgreementBC:
    visitor: принята
    car:     принята, manager department = Л ? Зиновьев : Татаринова, observersText department = Л ? Курандикова
    goods:   принята, manager department = Л ? null : Татаринова
    service: принята, manager department = Л ? Зиновьев : Татаринова, observersText department = Л ? Курандикова, asignee = альфаком
