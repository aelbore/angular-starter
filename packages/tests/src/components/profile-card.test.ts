import { ComponentFixture, TestBed } from '@angular/core/testing'
import { ProfileCardComponent } from '@lithium/components/profile-card'

import { By } from '@angular/platform-browser'

describe('ProfileCard', () => { 
  let fixture: ComponentFixture<ProfileCardComponent>
  let component: ProfileCardComponent

  beforeAll(() => {
    TestBed.configureTestingModule({
      imports: [ProfileCardComponent],
    })
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileCardComponent)
    component = fixture.componentInstance
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should display correct value', () => {
    component.value = {
      nbkId: 'zkzujo6',
      name: 'Arjay Elbore',
      image: 'https://2019.ng-my.org/assets/imgs/speakers/arjay-elbore.webp',
      title: 'Managing Director',
      role: 'Head Corporate Banking',
      email: 'arjay.elbore@bofa.com',
      phone: {
        office: '121212121',
        mobile: '+6598142033'
      }
    }
    fixture.detectChanges()

    const compiled = fixture.debugElement
    expect(compiled.query(By.css('label[for="name"]')).nativeElement.textContent)
      .toEqual('Arjay Elbore')
    expect(compiled.query(By.css('label[for="title"]')).nativeElement.textContent)
      .toEqual('Managing Director')
  })
})