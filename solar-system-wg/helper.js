function Kg2EM(kilograms) {
  return kilograms / 5.9722E24;
}

function EM2Kg(earthsMasses) {
  return earthsMasses * 5.9722E24;
}

function Km2AU(kilometers) {
  return kilometers / 1.49597870700E8;
}

function AU2Km(astronomicalUnits) {
  return astronomicalUnits * 1.49597870700E8;
}

function º2r(degrees) {
  return degrees * Math.PI / 180;
}

function s2Y(seconds) {
  return seconds / 3.154E7;
}

function Y2s(years) {
  return years * 3.154E7;
}

function KmPs2AUPY(kilometersPerSecond) {
  return Km2AU(kilometersPerSecond) * 3.154E7;
}

function AUPY2KmPs(astronomicalUnitsPerYear) {
  return AU2Km(astronomicalUnitsPerYear) * Y2s(1);
}