import cleanURL from './cleanURL';
import NavItem from './../blocks/NavItem/NavItem';
import BranchSelect from './../blocks/BranchSelect/BranchSelect';

window.onload = () => {
  cleanURL();
  NavItem();
  BranchSelect();
};
