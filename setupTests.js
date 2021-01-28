import { configure } from "enzyme";
// import Adapter from "enzyme-adapter-react-16";
// as there is an issue with enzyme-adapter-react-16 with react17
// fall back onto this package for now
// https://stackoverflow.com/a/64597067/2332101
import Adapter from "@wojtekmaj/enzyme-adapter-react-17";
configure({ adapter: new Adapter() });