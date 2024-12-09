import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaybacksdkComponent } from './playbacksdk.component';

describe('PlaybacksdkComponent', () => {
  let component: PlaybacksdkComponent;
  let fixture: ComponentFixture<PlaybacksdkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PlaybacksdkComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PlaybacksdkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
