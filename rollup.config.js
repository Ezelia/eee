// rollup.config.js
import typescript from 'rollup-plugin-typescript2';
import dts from "rollup-plugin-dts";


export default [
  {
    input: 'src/index.ts',
    output: [{
      file: "dist/eee.es6.js",
      format: 'es'
    },
    {
      file: "dist/eee.iife.js",
      format: 'iife',
      name:'eee'
    },
    {
      file: "dist/eee.umd.js",
      format: 'umd',
      name:'eee'
    }
  ],
    plugins: [
      typescript()
    ]
  }
  ,
  {
    input: 'src/index.ts',
    output: [{ file: "dist/eee.d.ts", format: "es" }],
    plugins: [dts()],
    onwarn: function ( message ) {
      if ( /Unresolved dependencies/.test( message ) ) return;
      if ( /Circular dependencies/.test( message ) ) return;
    }    
  }
  
];