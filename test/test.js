chrome.storage = {
  local : {
    remove : function () {}
  }
};

describe( 'chromeCall' , function () {
  describe( '调用 chorme api 时' , function () {

    beforeEach( function () {
      spyOn( chrome.storage.local , 'remove' ).and.callFake( function ( key , value , cb ) {
        expect( this ).toBe( chrome.storage.local );
        expect( key ).toBe( 'a' );
        expect( value ).toBe( 'b' );
        expect( typeof cb ).toBe( 'function' );
        setTimeout( function () {
          cb( 'c' );
        } , 100 );
      } );
    } );

    it( '若正常执行则 resolve promise' , function ( done ) {
      chromeCall( 'storage.local.remove' , 'a' , 'b' )
        .then( function ( value ) {
          expect( value ).toBe( 'c' );
          done();
        } , function () {
          fail( '没有进入 resolve 分支' );
          done();
        } );
    } );

    it( '若执行时出错则会 reject promise' , function ( done ) {
      chrome.runtime.lastError = 'hello error';
      chromeCall( 'storage.local.remove' , 'a' , 'b' )
        .then( function () {
          fail( '没有进入 reject 分支' );
          chrome.runtime.lastError = null;
          done();
        } , function ( error ) {
          expect( error ).toBe( 'hello error' );
          chrome.runtime.lastError = null;
          done();
        } );
    } );

  } );

  describe( '调用 chrome api 时' , function () {
    beforeEach( function () {
      spyOn( chrome.storage.local , 'remove' ).and.callFake( function ( cb ) {
        cb( 'x' , 'y' , 'z' );
      } );
    } );

    it( '默认情况下，promise 只返回第一个参数' , function ( done ) {
      chromeCall( 'storage.local.remove' )
        .then( function ( value ) {
          expect( Array.isArray( value ) ).toBe( false );
          expect( value ).toBe( 'x' );
          done();
        } , function () {
          fail( '没有进入 resolve 分支' );
          done();
        } );
    } );

    it( '但如果第一个参数是 true，则返回一个数组' , function ( done ) {
      chromeCall( true , 'storage.local.remove' )
        .then( function ( value ) {
          expect( Array.isArray( value ) ).toBe( true );
          expect( value ).toEqual( [ 'x' , 'y' , 'z' ] );
          done();
        } , function () {
          fail( '没有进入 resolve 分支' );
          done();
        } );
    } );

  } );

  it( '若找不到指定的路径则会报错' , function () {
    expect( function () {
      chromeCall( 'x.y.z' );
    } ).toThrow();
  } );

  describe( '作用域' , function () {

    beforeEach( function () {
      spyOn( chrome.storage.local , 'remove' );
    } );

    it( '可以用字符串声明' , function ( done ) {
      var local = chromeCall.scope( 'storage.local' );

      chrome.storage.local.remove.and.callFake( function ( cb ) {
        cb( 'hi' );
      } );

      local( 'remove' )
        .then( function ( x ) {
          expect( x ).toBe( 'hi' );
          done();
        } , function () {
          fail( '没有进入 resolve 分支' );
          done();
        } );
    } );

    it( '可以直接用对象声明' , function ( done ) {
      var local = chromeCall.scope( chrome.storage.local );

      chrome.storage.local.remove.and.callFake( function ( cb ) {
        cb( 'hi' );
      } );

      local( 'remove' )
        .then( function ( x ) {
          expect( x ).toBe( 'hi' );
          done();
        } , function () {
          fail( '没有进入 resolve 分支' );
          done();
        } );
    } );

  } );
} );
