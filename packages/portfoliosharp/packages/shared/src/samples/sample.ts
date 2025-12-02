

// < Run javascript module in browser >

// import { TZDate } from "@date-fns/tz";
// import { getFunctionDetails } from "../data/options/functions/site.data.options.functions.js";
// import type { CustomFunctionsWithContext } from "../data/site.data.types.js";
// import { fields } from "../helpers/helpers.general.js";
// import { addHours } from "date-fns";

// const moduleData = `
//     function hello() { alert('hello'); }
//     export function callMe() { hello(); }
// `;

// const blob = new Blob([moduleData], { type: 'application/javascript' });
// const url = URL.createObjectURL(blob);

// const g = await import(url);
// g.callMe();

// URL.revokeObjectURL(url);

// </ Run javascript module in browser >


// < Testing creating module >

// import { createModule } from "../helpers/helpers.modules.js";
// const moduleData = "import {join} from 'path'; import { tmpdir } from 'os'; function hello() { console.log(join(tmpdir(), '12345.txt')); }; export function callMe() { hello(); }";
// const r = await createModule(moduleData);
// r?.callMe();

// </ Testing creating module >


// < Run javascript functions in browser >


// const declaredFunctions = {}; 
// for (const i = 0; i < functions.length; i++) { 
//      declaredFunctions[functions[i].name] = {
//          fn: new Function(functions[i].arguments, functions[i].body), 
//          args: functions[i].arguments.split(",").map(x => x.trim()) 
//      }    
// } 
// for (const i = 0; i < 10; i++) { 
//      const funcWithArgs = declaredFunctions["getCatholicEasterByYear"]; 
//      const args = []; 
//      for (const j = 0; j < funcWithArgs.args.length; j++) { 
//          switch(funcWithArgs.args[j]) { 
//              case 'year': args.push(2016+i); break; 
//              default: args.push(undefined); break; 
//          } 
//      } 
//      const date = funcWithArgs.fn.call(this, ...args); 
//      console.log(date); 
// }    


// </ Run javascript functions in browser >

// < Testing removing keys from type >

// // Mock functions
// function getStartDateAndEndDate() {}
// function validateAndCleanDate() {}

// // Define utilities with `as const`
// export const siteDataOptionsFunctionsUtilities = {
//     getStartDateAndEndDate: {
//         function: getStartDateAndEndDate,
//         canBeAccessedFromOtherFunctions: false,
//     },
//     validateAndCleanDate: {
//         function: validateAndCleanDate,
//         canBeAccessedFromOtherFunctions: true,
//     },
// } as const;

// // Derive types
// type PublicKeys = {
//     [K in keyof typeof siteDataOptionsFunctionsUtilities]:
//     (typeof siteDataOptionsFunctionsUtilities)[K] extends { canBeAccessedFromOtherFunctions: true }
//     ? K
//     : never;
// }[keyof typeof siteDataOptionsFunctionsUtilities];

// type PublicFunctions = Pick<typeof siteDataOptionsFunctionsUtilities, PublicKeys>;

// // Now test
// const d: { [K in keyof PublicFunctions]: string } = {
//     validateAndCleanDate: ''
// };

// </ Testing removing keys from type >

// < Testing fields object helper function >

// console.log(Object.keys(fields<CustomFunctionsWithContext>({ context: '', functions: [] })));

// </ Testing fields object helper function >

// < Testing overriding toString on a parent class >

// class Test {
//     a = 3;
// }

// class TestB extends Test {

// }

// Test.prototype.toString = function(): string {
//     return `The number is: ${this.a}`;
// }

// const test = new TestB();
// console.log(""+test);

// </ Testing overriding toString on a parent class >

// < Testing variables which have a function assigned to see if name of variable is returned (Result: NOT) >

// const func = () => { return !true || false || !!1 || 0; }

// const x = func;

// console.log(JSON.stringify(await getFunctionDetails(x)));

// </ Testing variables which have a function assigned to see if name of variable is returned (Result: NOT) >

// < Testing daylight savings time shift >

// const date = new TZDate(2025, 9, 26, 2, 0, 0, "Europe/Madrid");

// const date1 = addHours(date, 1);
// const date2 = addHours(date1, 1);

// console.log(date);
// console.log(date1);
// console.log(date2);

// </ Testing daylight savings time shift >
